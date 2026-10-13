"""Email alerts for new inquiries over SMTP. Configured entirely from environment variables;
when SMTP isn't configured, alerts are skipped (logged) and the site works as before.

    SMTP_HOST        mail server, e.g. smtp.gmail.com / smtp.office365.com
    SMTP_PORT        587 (STARTTLS, default), 465 (SSL) or 2525 (many providers' alternative)
    SMTP_SECURITY    starttls (default) | ssl | none
    SMTP_USER        login, usually the mailbox address
    SMTP_PASSWORD    password or app password
    SMTP_FROM        sender shown on alerts, e.g. "SecureGov Website <alerts@yourdomain.ie>"
    NOTIFY_EMAILS    comma-separated recipients of inquiry alerts
    ADMIN_URL        link to the admin inbox included in alerts, e.g. https://…/admin/messages
"""

import logging
import os
import smtplib
import ssl
from email.message import EmailMessage
from email.utils import formataddr, make_msgid

from starlette.concurrency import run_in_threadpool

logger = logging.getLogger(__name__)


def _env(name: str, default: str = "") -> str:
    return os.environ.get(name, default).strip()


def recipients() -> list[str]:
    return [r.strip() for r in _env("NOTIFY_EMAILS").split(",") if r.strip()]


def enabled() -> bool:
    return bool(_env("SMTP_HOST") and recipients() and (_env("SMTP_FROM") or _env("SMTP_USER")))


def _one_line(value: str) -> str:
    """Header-safe: visitor input must never add header lines."""
    return " ".join(str(value).split())[:160]


def _send(msg: EmailMessage) -> None:
    host, port = _env("SMTP_HOST"), int(_env("SMTP_PORT", "587") or 587)
    security = _env("SMTP_SECURITY", "starttls").lower()
    user, password = _env("SMTP_USER"), os.environ.get("SMTP_PASSWORD", "")
    context = ssl.create_default_context()
    if security == "ssl":
        server: smtplib.SMTP = smtplib.SMTP_SSL(host, port, context=context, timeout=20)
    else:
        server = smtplib.SMTP(host, port, timeout=20)
    with server:
        if security == "starttls":
            server.starttls(context=context)
        if user:
            server.login(user, password)
        server.send_message(msg)


async def send_inquiry_alert(*, kind: str, name: str, email: str, fields: list[tuple[str, str]], body: str = "") -> None:
    """Email the team about a new inquiry. Never raises — a mail problem must not break the form."""
    if not enabled():
        logger.info("Email alerts not configured (SMTP_HOST / NOTIFY_EMAILS / SMTP_FROM) — skipping %s alert", kind)
        return
    to = recipients()
    sender = _env("SMTP_FROM") or _env("SMTP_USER")
    inbox = _env("ADMIN_URL")

    msg = EmailMessage()
    msg["Subject"] = _one_line(f"New {kind} — {name}")
    msg["From"] = sender
    msg["To"] = ", ".join(to)
    msg["Reply-To"] = formataddr((_one_line(name), _one_line(email)))
    msg["Message-ID"] = make_msgid(domain="securegov.local")

    # Single-line fields stay single-line in the body too, so a crafted name can't fake extra lines.
    lines = [f"New {kind} on the SecureGov demo site.", "", f"Name:  {_one_line(name)}", f"Email: {_one_line(email)}"]
    lines += [f"{label}: {_one_line(value)}" for label, value in fields]
    if body:
        lines += ["", "Message:", body]
    lines += ["", "Reply to this email to answer the visitor directly."]
    if inbox:
        lines += [f"Or open the admin inbox: {inbox}"]
    msg.set_content("\n".join(lines))

    try:
        await run_in_threadpool(_send, msg)
        logger.info("Sent %s alert to %d recipient(s)", kind, len(to))
    except Exception as exc:  # network, auth, TLS… log it and move on
        logger.error("Could not send %s alert via %s: %s", kind, _env("SMTP_HOST"), exc)
