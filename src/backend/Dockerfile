FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar apenas os arquivos de projeto primeiro para otimizar cache
COPY ["InvoiceMate.Api/InvoiceMate.Api.csproj", "InvoiceMate.Api/"]
COPY ["InvoiceMate.Application/InvoiceMate.Application.csproj", "InvoiceMate.Application/"]
COPY ["InvoiceMate.Domain/InvoiceMate.Domain.csproj", "InvoiceMate.Domain/"]
COPY ["InvoiceMate.Infrastructure/InvoiceMate.Infrastructure.csproj", "InvoiceMate.Infrastructure/"]

RUN dotnet restore "InvoiceMate.Api/InvoiceMate.Api.csproj"

COPY . .

WORKDIR "/src/InvoiceMate.Api"
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

RUN pwsh /app/publish/playwright.ps1 install chromium

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app


EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080
ENV DOTNET_RUNNING_IN_CONTAINER=true

RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libx11-6 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libdbus-1-3 \
    libexpat1 \
    libatspi2.0-0 \
 && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

COPY --from=build /root/.cache/ms-playwright /root/.cache/ms-playwright

ENTRYPOINT ["dotnet", "InvoiceMate.Api.dll"]
