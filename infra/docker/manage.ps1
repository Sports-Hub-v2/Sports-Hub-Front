# PowerShell script for managing SportHub infrastructure
# Usage: ./manage.ps1 [command]
# Commands: start, stop, restart, status, logs, reset, test-data, clean

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "🏟️  SportHub Infrastructure Manager" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: ./manage.ps1 [command]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Green
    Write-Host "  start      - Start all services"
    Write-Host "  stop       - Stop all services"
    Write-Host "  restart    - Restart all services"
    Write-Host "  status     - Show service status"
    Write-Host "  logs       - Show logs for all services"
    Write-Host "  reset      - Reset database (clean start)"
    Write-Host "  test-data  - Add test data to recruit service"
    Write-Host "  clean      - Clean up unused Docker resources"
    Write-Host "  help       - Show this help"
}

function Start-Services {
    Write-Host "🚀 Starting SportHub services..." -ForegroundColor Cyan
    docker-compose up -d
    Write-Host "✅ Services started!" -ForegroundColor Green
    Show-Status
}

function Stop-Services {
    Write-Host "🛑 Stopping SportHub services..." -ForegroundColor Yellow
    docker-compose down
    Write-Host "✅ Services stopped!" -ForegroundColor Green
}

function Restart-Services {
    Write-Host "🔄 Restarting SportHub services..." -ForegroundColor Cyan
    docker-compose down
    docker-compose up -d
    Write-Host "✅ Services restarted!" -ForegroundColor Green
    Show-Status
}

function Show-Status {
    Write-Host "📊 Service Status:" -ForegroundColor Cyan
    docker-compose ps
    Write-Host ""
    Write-Host "🌐 Service URLs:" -ForegroundColor Blue
    Write-Host "  Auth Service:         http://localhost:8081"
    Write-Host "  User Service:         http://localhost:8082"
    Write-Host "  Team Service:         http://localhost:8083"
    Write-Host "  Recruit Service:      http://localhost:8084"
    Write-Host "  Notification Service: http://localhost:8085"
    Write-Host "  MySQL Database:       localhost:3306"
}

function Show-Logs {
    Write-Host "📋 Showing logs for all services..." -ForegroundColor Cyan
    docker-compose logs --tail=50 -f
}

function Reset-Database {
    Write-Host "⚠️  This will DELETE ALL DATA and start fresh!" -ForegroundColor Red
    $confirm = Read-Host "Are you sure? (yes/no)"
    
    if ($confirm -eq "yes") {
        Write-Host "🗑️  Stopping services and removing data..." -ForegroundColor Yellow
        docker-compose down
        
        # Remove MySQL volume
        $volumes = docker volume ls --filter name=sportshub_mysql-data -q
        if ($volumes) {
            docker volume rm $volumes
            Write-Host "✅ Database volume removed" -ForegroundColor Green
        }
        
        Write-Host "🚀 Starting fresh services..." -ForegroundColor Cyan
        docker-compose up -d
        
        Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
        Start-Sleep 15
        
        Write-Host "✅ Fresh environment ready!" -ForegroundColor Green
        Show-Status
    } else {
        Write-Host "❌ Reset cancelled" -ForegroundColor Red
    }
}

function Add-TestData {
    Write-Host "📝 Adding test data..." -ForegroundColor Cyan
    
    # Check if recruit service is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8084/health" -Method GET -TimeoutSec 5
        Write-Host "✅ Recruit service is running" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Recruit service is not accessible. Please start services first." -ForegroundColor Red
        return
    }
    
    # Run test data script
    .\add-test-data.ps1
}

function Clean-Docker {
    Write-Host "🧹 Cleaning up Docker resources..." -ForegroundColor Cyan
    
    # Remove stopped containers
    $stoppedContainers = docker ps -a -q --filter "status=exited"
    if ($stoppedContainers) {
        docker rm $stoppedContainers
        Write-Host "✅ Removed stopped containers" -ForegroundColor Green
    }
    
    # Remove unused images
    docker image prune -f
    Write-Host "✅ Removed unused images" -ForegroundColor Green
    
    # Remove unused networks
    docker network prune -f
    Write-Host "✅ Removed unused networks" -ForegroundColor Green
    
    Write-Host "✅ Docker cleanup complete!" -ForegroundColor Green
}

# Main command execution
switch ($Command.ToLower()) {
    "start" { Start-Services }
    "stop" { Stop-Services }
    "restart" { Restart-Services }
    "status" { Show-Status }
    "logs" { Show-Logs }
    "reset" { Reset-Database }
    "test-data" { Add-TestData }
    "clean" { Clean-Docker }
    "help" { Show-Help }
    default { 
        Write-Host "❌ Unknown command: $Command" -ForegroundColor Red
        Show-Help 
    }
}
