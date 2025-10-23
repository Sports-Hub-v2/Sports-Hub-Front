# PowerShell script to add clean test data to the recruit service
# 사용법: ./add-test-data.ps1

Write-Host "🎯 Adding clean test data to recruit service..." -ForegroundColor Cyan

# API 엔드포인트 설정
$baseUrl = "http://localhost:8084/api/recruit/posts"
$headers = @{"Content-Type" = "application/json"}

# 테스트 데이터 배열
$testPosts = @(
    @{
        teamId = 1
        writerProfileId = 2
        title = "[Gangnam] Need 1 midfielder for morning football"
        content = "Location: Futsal court near Seolleung Station`nTime: Tomorrow 6:00-8:00 AM`nCurrent players: 9/10`n`nUrgently need 1 more player!`n- Position: Midfielder preferred`n- Skill: Any level welcome`n- Contact: 010-1234-5678"
        region = "Seoul"
        matchDate = "2025-09-11"
        category = "MERCENARY"
        targetType = "USER"
        status = "RECRUITING"
    },
    @{
        teamId = 2
        writerProfileId = 3
        title = "[Hongdae] Dawn football team member recruitment"
        content = "Location: Hongdae World Cup Park`nTime: Every Tue/Thu/Sat 5:30-7:30 AM`nNeeded: 2-3 players`n`nTeam info:`n- Office workers in 20s-30s`n- We value manners over skill`n`nContact: 010-9876-5432"
        region = "Seoul"
        matchDate = "2025-09-12"
        category = "MERCENARY"
        targetType = "USER"
        status = "RECRUITING"
    },
    @{
        teamId = 3
        writerProfileId = 4
        title = "[Yongsan] URGENT! Need 2 players for tonight"
        content = "Emergency! Need 2 futsal players for tonight!`n`nLocation: Itaewon Indoor Futsal Court`nTime: Tonight 7:00-9:00 PM`nCurrent: 8/10 players`n`nSituation:`n- 2 players cancelled last minute`n- Any skill level welcome`n`nContact immediately: 010-5555-7777"
        region = "Seoul"
        matchDate = "2025-09-09"
        category = "MERCENARY"
        targetType = "USER"
        status = "RECRUITING"
    },
    @{
        teamId = 4
        writerProfileId = 5
        title = "[Individual] Looking for team to join"
        content = "Hello! I want to join a team as a mercenary player.`n`nAbout me:`n- Age: 28`n- Position: Midfielder/Forward`n- Experience: 4 years university club`n- Skill: Intermediate level`n`nAvailable:`n- Weekdays: 6:00-8:00 AM`n- Weekends: Morning preferred`n`nPreferred areas: Gangnam, Seocho, Songpa`n`nContact: 010-1111-2222 (Lee Minsu)"
        region = "Seoul"
        matchDate = "2025-09-10"
        category = "MERCENARY"
        targetType = "TEAM"
        status = "RECRUITING"
    }
)

Write-Host "📋 Adding $($testPosts.Count) test posts..." -ForegroundColor Yellow

# 각 테스트 데이터 추가
$successCount = 0
foreach ($post in $testPosts) {
    try {
        $jsonData = $post | ConvertTo-Json -Depth 10
        $response = Invoke-WebRequest -Uri $baseUrl -Method POST -Headers $headers -Body $jsonData
        
        if ($response.StatusCode -eq 201) {
            $responseData = $response.Content | ConvertFrom-Json
            Write-Host "✅ Created post: '$($post.title)' (ID: $($responseData.id))" -ForegroundColor Green
            $successCount++
        }
    }
    catch {
        Write-Host "❌ Failed to create post: '$($post.title)'" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Successfully added $successCount/$($testPosts.Count) test posts!" -ForegroundColor Cyan

# 최종 확인
try {
    $allPosts = Invoke-WebRequest -Uri $baseUrl -Method GET | ConvertFrom-Json
    Write-Host "📊 Total posts in database: $($allPosts.Count)" -ForegroundColor Blue
}
catch {
    Write-Host "⚠️  Could not verify total post count" -ForegroundColor Yellow
}
