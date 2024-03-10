using MailKit.Net.Smtp;
using MimeKit;

namespace SalusConnect.Api.Services;

public interface IEmailService
{
    Task SendEmailAsync(MailRequest mailRequest);

    // Task SendGridEmailAsync(string email, string subject, string message);
}

public class EmailService : IEmailService
{
    private readonly AppSettings _appSettings;

    public EmailService(IOptions<AppSettings> options)
    {
        _appSettings = options.Value;
    }

    public async Task SendEmailAsync(MailRequest mailRequest)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(_appSettings.MailSettings.DisplayName, _appSettings.MailSettings.FromEmail)); // MailboxAddress.Parse(_appSettings.MailSettings.FromEmail));
        email.ReplyTo.Add(MailboxAddress.Parse("noreply@salusconnect.ca"));
        string[] toAddresses = mailRequest.ToEmail.Split(';');
        foreach (string toAddress in toAddresses)
        {
            email.To.Add(MailboxAddress.Parse(toAddress));
        }
        email.Subject = mailRequest.Subject;
        email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = mailRequest.Body };

        using var smtp = new SmtpClient(); //_appSettings.MailSettings.Host, _appSettings.MailSettings.Port)
        await smtp.ConnectAsync(_appSettings.MailSettings.Host, _appSettings.MailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_appSettings.MailSettings.FromEmail, _appSettings.MailSettings.Password);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }

    //public Task SendGridEmailAsync(string email, string subject, string message)
    //{
    //    //return Execute(_appSettings.MailSettings.SendGridKey, subject, message, email);
    //    throw new NotImplementedException();
    //}

    //public Task Execute(string apiKey, string subject, string message, string email)
    //{
    //    var client = new SendGridClient(apiKey);
    //    var msg = new SendGridMessage
    //    {
    //        From = new EmailAddress("admin@salusconnect.ca", "SalusConnect"),
    //        Subject = subject,
    //        PlainTextContent = message,
    //        HtmlContent = message
    //    };
    //    msg.AddTo(new EmailAddress(email));

    //    // Disable click tracking.
    //    // See https://sendgrid.com/docs/User_Guide/Settings/tracking.html
    //    msg.SetClickTracking(false, false);

    //    return client.SendEmailAsync(msg);
    //}
}