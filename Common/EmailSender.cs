using System;
using System.Net;
using System.Net.Mail;
using RazorEngine;
using RazorEngine.Templating;
using AngularNETcore.Models;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using System.Diagnostics;
using RazorEngine.Configuration;
using RazorEngine.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace AngularNETcore.Common
{
    public class EmailSender: IEmailSender
    {
        private readonly IWebHostEnvironment environment;
        private readonly IViewRenderService render;
        private readonly IConfiguration config;

        private readonly string From;
        private readonly string SmtpUserName;
        private readonly string SmtpPassword;
        private readonly string SmtpHost;
        private readonly int SmtpPort;
        public EmailSender(IWebHostEnvironment hostEnvironment, IViewRenderService _render, IConfiguration _config)
        {
            render = _render;
            environment = hostEnvironment;
            config = _config;
            From = config.GetSection("SMTPoptions").GetSection("SMTP1").GetSection(nameof(From)).Value;
            SmtpUserName = config.GetSection("SMTPoptions").GetSection("SMTP1").GetSection(nameof(SmtpUserName)).Value;
            SmtpPassword = config.GetSection("SMTPoptions").GetSection("SMTP1").GetSection(nameof(SmtpPassword)).Value;
            SmtpHost = config.GetSection("SMTPoptions").GetSection("SMTP1").GetSection(nameof(SmtpHost)).Value;
            SmtpPort = Convert.ToInt32(config.GetSection("SMTPoptions").GetSection("SMTP1").GetSection(nameof(SmtpPort)).Value);
        }

        public async Task<string> SendRestorePasswordEmailAsync(User model)
        {
            string FROM = From;            
            string TO = model.userEmail;
            string SMTP_USERNAME = SmtpUserName;
            string SMTP_PASSWORD = SmtpPassword;
            string HOST = SmtpHost;
            int PORT = SmtpPort;
            string FROMNAME = "Admin Noreply";
            string SUBJECT = "Password Reset";
            MailMessage message = new MailMessage();
            message.IsBodyHtml = true;
            message.From = new MailAddress(FROM, FROMNAME);
            message.To.Add(new MailAddress(TO));
            message.Subject = SUBJECT;
            message.Body = await draftRestorePasswordMail(model);
            using (var client = new SmtpClient(HOST, PORT))
            {
                client.Credentials = new NetworkCredential(SMTP_USERNAME, SMTP_PASSWORD);
                client.EnableSsl = true;
                try
                {
                    client.Send(message);
                }
                catch (Exception ex)
                {
                    return ex.Message;
                }
            }
            return "000";
        }

        private async Task<string> draftRestorePasswordMail(User model)
        {
            string staticContentDirectory = environment.WebRootPath;
            string path = "~/wwwroot/Template/Email/RestorePassword.cshtml";
            return await render.RenderToStringAsync(path, model);
        }


    }

    public interface IEmailSender
    {
        Task<string> SendRestorePasswordEmailAsync(User model);
    }
}
