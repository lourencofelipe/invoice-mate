var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddOpenApi();
builder.Services.AddAutoMapper();
builder.Services.AddValidators();

builder.Services.AddSwaggerGen();

var port = Environment.GetEnvironmentVariable("PORT") ?? "5001";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var clientOrigin = builder.Configuration["ClientOrigin"];

// Add CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFront",
        policy => policy
            .WithOrigins(clientOrigin)
            .AllowAnyMethod()
            .AllowAnyHeader());
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    })
    .ConfigureApiBehaviorOptions(options => 
    {
        options.SuppressModelStateInvalidFilter = true;
    });


// Infra stubs (replace later with real implementations)
//builder.Services.AddSingleton<IEmailSender, EmailSenderConsole>();  // Infrastructure.Services.EmailSenderConsole
// If using limits now:
// builder.Services.AddSingleton<IUsageLimiter, InMemoryUsageLimiter>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ProblemDetailsMiddleware>();
app.UseExceptionHandler("/error");
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "InvoiceMate API");
});

app.UseCors("AllowFront");

app.UseAuthorization();

app.MapControllers();

app.Run();
