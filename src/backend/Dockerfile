FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["InvoiceMate.sln", "./"]
COPY ["InvoiceMate.Api/InvoiceMate.Api.csproj", "InvoiceMate.Api/"]
COPY ["InvoiceMate.Application/InvoiceMate.Application.csproj", "InvoiceMate.Application/"]
COPY ["InvoiceMate.Domain/InvoiceMate.Domain.csproj", "InvoiceMate.Domain/"]
COPY ["InvoiceMate.Infrastructure/InvoiceMate.Infrastructure.csproj", "InvoiceMate.Infrastructure/"]
COPY ["InvoiceMate.Tests/InvoiceMate.Tests.csproj", "InvoiceMate.Tests/"]

# Restore dependencies
RUN dotnet restore

# Copy the rest of the source code
COPY . .

# Build and publish
WORKDIR "/src/InvoiceMate.Api"
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/playwright/dotnet:v1.54.0-noble AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "InvoiceMate.Api.dll"]
