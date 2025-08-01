var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddOpenApi();
builder.Services.AddAutoMapper();
builder.Services.AddValidators();

builder.Services.AddSwaggerGen();
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
app.UseExceptionHandler("/error"); // add an /error endpoint or your middleware
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "InvoiceMate API");
});

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
