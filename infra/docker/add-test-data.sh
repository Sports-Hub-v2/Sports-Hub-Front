#!/bin/bash
# Shell script to add clean test data to the recruit service
# Usage: ./add-test-data.sh

echo "🎯 Adding clean test data to recruit service..."

# API endpoint
BASE_URL="http://localhost:8084/api/recruit/posts"

# Function to add a post
add_post() {
    local title="$1"
    local json_data="$2"
    
    echo "📝 Adding: $title"
    
    response=$(curl -s -w "%{http_code}" -o response.tmp \
        -X POST \
        -H "Content-Type: application/json" \
        -d "$json_data" \
        "$BASE_URL")
    
    if [ "$response" = "201" ]; then
        post_id=$(cat response.tmp | grep -o '"id":[0-9]*' | cut -d':' -f2)
        echo "✅ Created post: '$title' (ID: $post_id)"
        return 0
    else
        echo "❌ Failed to create post: '$title' (HTTP: $response)"
        cat response.tmp
        return 1
    fi
}

# Test data
success_count=0
total_count=4

# Post 1: Gangnam morning football
add_post "[Gangnam] Need 1 midfielder for morning football" '{
    "teamId": 1,
    "writerProfileId": 2,
    "title": "[Gangnam] Need 1 midfielder for morning football",
    "content": "Location: Futsal court near Seolleung Station\nTime: Tomorrow 6:00-8:00 AM\nCurrent players: 9/10\n\nUrgently need 1 more player!\n- Position: Midfielder preferred\n- Skill: Any level welcome\n- Contact: 010-1234-5678",
    "region": "Seoul",
    "matchDate": "2025-09-11",
    "category": "MERCENARY",
    "targetType": "USER",
    "status": "RECRUITING"
}' && ((success_count++))

# Post 2: Hongdae dawn football
add_post "[Hongdae] Dawn football team member recruitment" '{
    "teamId": 2,
    "writerProfileId": 3,
    "title": "[Hongdae] Dawn football team member recruitment",
    "content": "Location: Hongdae World Cup Park\nTime: Every Tue/Thu/Sat 5:30-7:30 AM\nNeeded: 2-3 players\n\nTeam info:\n- Office workers in 20s-30s\n- We value manners over skill\n\nContact: 010-9876-5432",
    "region": "Seoul",
    "matchDate": "2025-09-12",
    "category": "MERCENARY",
    "targetType": "USER",
    "status": "RECRUITING"
}' && ((success_count++))

# Post 3: Yongsan urgent
add_post "[Yongsan] URGENT! Need 2 players for tonight" '{
    "teamId": 3,
    "writerProfileId": 4,
    "title": "[Yongsan] URGENT! Need 2 players for tonight",
    "content": "Emergency! Need 2 futsal players for tonight!\n\nLocation: Itaewon Indoor Futsal Court\nTime: Tonight 7:00-9:00 PM\nCurrent: 8/10 players\n\nSituation:\n- 2 players cancelled last minute\n- Any skill level welcome\n\nContact immediately: 010-5555-7777",
    "region": "Seoul",
    "matchDate": "2025-09-09",
    "category": "MERCENARY",
    "targetType": "USER",
    "status": "RECRUITING"
}' && ((success_count++))

# Post 4: Individual looking for team
add_post "[Individual] Looking for team to join" '{
    "teamId": 4,
    "writerProfileId": 5,
    "title": "[Individual] Looking for team to join",
    "content": "Hello! I want to join a team as a mercenary player.\n\nAbout me:\n- Age: 28\n- Position: Midfielder/Forward\n- Experience: 4 years university club\n- Skill: Intermediate level\n\nAvailable:\n- Weekdays: 6:00-8:00 AM\n- Weekends: Morning preferred\n\nPreferred areas: Gangnam, Seocho, Songpa\n\nContact: 010-1111-2222 (Lee Minsu)",
    "region": "Seoul",
    "matchDate": "2025-09-10",
    "category": "MERCENARY",
    "targetType": "TEAM",
    "status": "RECRUITING"
}' && ((success_count++))

echo
echo "🎉 Successfully added $success_count/$total_count test posts!"

# Final verification
echo "📊 Verifying total posts..."
total_posts=$(curl -s "$BASE_URL" | grep -o '"id":[0-9]*' | wc -l)
echo "📋 Total posts in database: $total_posts"

# Cleanup
rm -f response.tmp

echo "✅ Test data setup complete!"
