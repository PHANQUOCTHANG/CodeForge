# Backend Dockerfile cho Development với Hot Reload
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["*.csproj", "./"]
RUN dotnet restore

# Copy source code
COPY . .

# Install dotnet-watch tool để hot reload
RUN dotnet tool install --global dotnet-watch

# Set PATH để có thể dùng dotnet watch
ENV PATH="${PATH}:/root/.dotnet/tools"

# Development stage
FROM build AS development
WORKDIR /app
COPY --from=build /src .

# Expose port
EXPOSE 8080

# Chạy với dotnet watch để hot reload
CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:8080"]