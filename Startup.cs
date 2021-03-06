using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
using System.Text;
using AngularNETcore.Common;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.ResponseCompression;
//using AngularNETcore.Common;
namespace AngularNETcore
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddMvc();
            //services.AddResponseCompression( options =>
            //{
            //    options.EnableForHttps = true;
            //    options.Providers.Add<GzipCompressionProvider>();
            //    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
            //        new[] {"image/svg+xml", "font/ttf", "font/eot", "font/opentype", "application/x-font-ttf" });
            //});
            services.AddControllersWithViews();
            var key = Encoding.ASCII.GetBytes(Configuration.GetSection("SecuritySettings").GetSection("Secret").Value);
            services.AddSingleton<IJwtService, JwtService>();
            services.AddScoped<IViewRenderService, ViewRenderService>();
            services.AddScoped<IEmailSender, EmailSender>();            
            services.ConfigureJwtValidationProcess(Configuration);
            services.AddSession();
            services.AddControllers().AddNewtonsoftJson();
            services.Configure<IISOptions>(options => { });
            // In production, the Angular files will be served from this directory

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            services.Configure<IISServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });
        }


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //app.UseResponseCompression();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                //app.Use(async (context, next) =>
                //{
                //    await next();
                //    if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value))
                //    {
                //        context.Request.Path = "/index.html";
                //        await next();
                //    }
                //});
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            //app.UseDefaultFiles();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }
            app.UseCors(options =>
            options.AllowAnyOrigin()
                .AllowAnyMethod().AllowAnyHeader());
            app.UseHttpsRedirection();
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.All
            });



            app.UseRouting();
            app.UseAuthentication();
            app.UseJwtLifetimeCustomValidation();
            app.UseJwtValidationAtDatabase(Configuration);
            app.UseAuthorization();
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                //endpoints.MapFallbackToController("Login", "User");
            });


            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
