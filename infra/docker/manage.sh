#!/bin/bash
# Shell script for managing SportHub infrastructure
# Usage: ./manage.sh [command]
# Commands: start, stop, restart, status, logs, reset, test-data, clean

COMMAND=${1:-help}

show_help() {
    echo "🏟️  SportHub Infrastructure Manager"
    echo ""
    echo "Usage: ./manage.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start      - Start all services"
    echo "  stop       - Stop all services"
    echo "  restart    - Restart all services"
    echo "  status     - Show service status"
    echo "  logs       - Show logs for all services"
    echo "  reset      - Reset database (clean start)"
    echo "  test-data  - Add test data to recruit service"
    echo "  clean      - Clean up unused Docker resources"
    echo "  help       - Show this help"
}

start_services() {
    echo "🚀 Starting SportHub services..."
    docker-compose up -d
    echo "✅ Services started!"
    show_status
}

stop_services() {
    echo "🛑 Stopping SportHub services..."
    docker-compose down
    echo "✅ Services stopped!"
}

restart_services() {
    echo "🔄 Restarting SportHub services..."
    docker-compose down
    docker-compose up -d
    echo "✅ Services restarted!"
    show_status
}

show_status() {
    echo "📊 Service Status:"
    docker-compose ps
    echo ""
    echo "🌐 Service URLs:"
    echo "  Auth Service:         http://localhost:8081"
    echo "  User Service:         http://localhost:8082"
    echo "  Team Service:         http://localhost:8083"
    echo "  Recruit Service:      http://localhost:8084"
    echo "  Notification Service: http://localhost:8085"
    echo "  MySQL Database:       localhost:3306 (container internal)"
}

show_logs() {
    echo "📋 Showing logs for all services..."
    docker-compose logs --tail=50 -f
}

reset_database() {
    echo "⚠️  This will DELETE ALL DATA and start fresh!"
    read -p "Are you sure? (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        echo "🗑️  Stopping services and removing data..."
        docker-compose down
        
        # Remove MySQL volume
        volumes=$(docker volume ls --filter name=sportshub_mysql-data -q)
        if [ ! -z "$volumes" ]; then
            docker volume rm $volumes
            echo "✅ Database volume removed"
        fi
        
        echo "🚀 Starting fresh services..."
        docker-compose up -d
        
        echo "⏳ Waiting for services to be ready..."
        sleep 15
        
        echo "✅ Fresh environment ready!"
        show_status
    else
        echo "❌ Reset cancelled"
    fi
}

add_test_data() {
    echo "📝 Adding test data..."
    
    # Check if recruit service is running
    if curl -s -f http://localhost:8084/health > /dev/null 2>&1; then
        echo "✅ Recruit service is running"
    else
        echo "❌ Recruit service is not accessible. Please start services first."
        return 1
    fi
    
    # Run test data script
    ./add-test-data.sh
}

clean_docker() {
    echo "🧹 Cleaning up Docker resources..."
    
    # Remove stopped containers
    stopped_containers=$(docker ps -a -q --filter "status=exited")
    if [ ! -z "$stopped_containers" ]; then
        docker rm $stopped_containers
        echo "✅ Removed stopped containers"
    fi
    
    # Remove unused images
    docker image prune -f
    echo "✅ Removed unused images"
    
    # Remove unused networks
    docker network prune -f
    echo "✅ Removed unused networks"
    
    echo "✅ Docker cleanup complete!"
}

# Make scripts executable
chmod +x add-test-data.sh 2>/dev/null

# Main command execution
case "$COMMAND" in
    "start")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "reset")
        reset_database
        ;;
    "test-data")
        add_test_data
        ;;
    "clean")
        clean_docker
        ;;
    "help")
        show_help
        ;;
    *)
        echo "❌ Unknown command: $COMMAND"
        show_help
        ;;
esac
