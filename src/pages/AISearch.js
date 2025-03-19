import React, { useState, useEffect, useRef } from 'react';
import { fetchAreaInfo } from '../utils/aiService';

// Custom CSS for animations
const customStyles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}
`;

// Default content for when API doesn't return specific details
const defaultDescriptions = {
  location: "Bangalore, known as the Garden City, is a vibrant metropolis that perfectly blends traditional charm with modern innovation. Home to beautiful parks, historic monuments, and a thriving tech industry, it offers visitors a unique mix of cultural heritage and contemporary experiences.",
  places: [
    {
      name: "Lalbagh Botanical Garden",
      description: "A historic garden with a diverse collection of tropical plants, an aquarium and a lake. The famous glass house hosts flower shows twice a year.",
      openingHours: "6 AM - 7 PM"
    },
    {
      name: "Cubbon Park",
      description: "A landmark 'lung' area of the city with rich flora and fauna. Perfect for morning walks, picnics, and relaxation in the heart of the city.",
      openingHours: "5 AM - 8 PM"
    },
    {
      name: "ISKCON Temple",
      description: "A beautiful marble temple dedicated to Lord Krishna, offering a peaceful spiritual experience with stunning architecture and soothing atmosphere.",
      openingHours: "7 AM - 8:30 PM"
    }
  ],
  restaurants: [
    {
      name: "MTR (Mavalli Tiffin Room)",
      description: "An iconic restaurant serving authentic South Indian cuisine since 1924. Famous for its masala dosa, rava idli, and filter coffee.",
      cuisine: "South Indian"
    },
    {
      name: "Vidyarthi Bhavan",
      description: "A legendary eatery known for its crispy, buttery dosas that attract long queues of devoted customers every weekend.",
      cuisine: "South Indian"
    },
    {
      name: "Truffles",
      description: "Popular for its American-style burgers, sandwiches, and pasta. A favorite among college students and young professionals.",
      cuisine: "Continental, American"
    }
  ],
  accommodations: [
    {
      name: "The Taj West End",
      description: "A luxurious heritage hotel set in a lush 20-acre garden, offering colonial charm with modern amenities and exceptional service.",
      priceRange: "Luxury"
    },
    {
      name: "Lemon Tree Premier",
      description: "A comfortable mid-range hotel with well-appointed rooms, multiple dining options, and a rooftop pool with city views.",
      priceRange: "Mid-range"
    },
    {
      name: "Zostel Bangalore",
      description: "A vibrant hostel offering both dormitory and private rooms, with common areas perfect for meeting fellow travelers.",
      priceRange: "Budget-friendly"
    }
  ]
};

const AISearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drawingProgress, setDrawingProgress] = useState(0);
  const [drawingCompleted, setDrawingCompleted] = useState(true);
  
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Animation hooks
  useEffect(() => {
    if (isLoading && canvasRef.current) {
      let animationStartTime = null;
      let lastFrameTime = 0;
      
      // Animation function
      const animate = (timestamp) => {
        if (!animationStartTime) animationStartTime = timestamp;
        const elapsedTime = timestamp - animationStartTime;
        const deltaTime = timestamp - lastFrameTime;
        lastFrameTime = timestamp;
        
        // Progressively increase but cap at 0.95 to ensure the animation continues 
        // until content is fully loaded
        const calculatedProgress = Math.min(0.95, elapsedTime / 10000); // Slower progression
        setDrawingProgress(calculatedProgress);
        
        // Continue animation as long as isLoading is true
        if (isLoading) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };
      
      // Reset animation state
      setDrawingProgress(0);
      setDrawingCompleted(false);
      
      // Start animation
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Cleanup function
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isLoading]);
  
  // Properly handle content loaded state
  useEffect(() => {
    if (!isLoading && searchResults) {
      // Set progress to 1 for final rendering state before hiding
      setDrawingProgress(1);
      
      // Set small timeout to allow final animation frame to render
      const finalTimeout = setTimeout(() => {
        setDrawingCompleted(true);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      }, 300); // Short delay for smooth transition
      
      return () => clearTimeout(finalTimeout);
    }
  }, [isLoading, searchResults]);
  
  // Main animation rendering - rich interactive scenes with multiple elements
  useEffect(() => {
    if (canvasRef.current && isLoading) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions properly
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Animation scenes - defines different visual stages as loading progresses
      const scenes = [
        { start: 0, end: 0.3, name: "night" }, // Night sky with stars
        { start: 0.3, end: 0.6, name: "dawn" }, // Sunrise and beginning of day
        { start: 0.6, end: 0.9, name: "day" },  // Full daylight
        { start: 0.9, end: 1, name: "complete" } // Final flourish
      ];
      
      // Determine current scene based on progress
      const getCurrentScene = (progress) => {
        for (const scene of scenes) {
          if (progress >= scene.start && progress < scene.end) {
            // Calculate normalized progress within this scene (0-1)
            const normalizedProgress = (progress - scene.start) / (scene.end - scene.start);
            return { ...scene, normalizedProgress };
          }
        }
        return { ...scenes[scenes.length - 1], normalizedProgress: 1 }; // Default to final scene
      };
      
      // Colors for different scenes
      const sceneColors = {
        night: {
          bg: { top: '#0A1128', bottom: '#1A2456' },
          stars: ['#FFFFFF', '#F8F7FF', '#FFFAC8', '#FFF4E0'],
          ground: { top: '#172121', bottom: '#0A0F0D' }
        },
        dawn: {
          bg: { top: '#614385', bottom: '#516395' },
          stars: ['#FFFFFF', '#FFF4E0'],
          ground: { top: '#172121', bottom: '#0A0F0D' },
          sun: { inner: '#FF7E5F', outer: '#FEB47B' }
        },
        day: {
          bg: { top: '#2980B9', bottom: '#6DD5FA' },
          ground: { top: '#2ECC40', bottom: '#006400' },
          sun: { inner: '#FDB813', outer: '#F8D568' },
          clouds: '#FFFFFF'
        },
        complete: {
          bg: { top: '#2980B9', bottom: '#6DD5FA' },
          ground: { top: '#2ECC40', bottom: '#006400' },
          sun: { inner: '#FDB813', outer: '#F8D568' },
          clouds: '#FFFFFF',
          sparkle: ['#FFFFFF', '#FFF8DC', '#FFD700']
        }
      };
      
      // Collection of animated objects
      const stars = [];
      const clouds = [];
      const buildings = [];
      const birds = [];
      const bubbles = [];
      
      // Dynamically create stars based on scene and progress
      const createStars = (scene, count) => {
        const colors = sceneColors[scene.name].stars || sceneColors.night.stars;
        while (stars.length < count) {
          stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height * 0.7),
            size: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            twinkle: Math.random() > 0.7,
            twinkleSpeed: Math.random() * 0.05 + 0.01,
            twinklePhase: Math.random() * Math.PI * 2
          });
        }
      };
      
      // Create buildings for city skyline
      const createBuildings = () => {
        if (buildings.length === 0) {
          const buildingCount = Math.floor(canvas.width / 50);
          const maxHeight = canvas.height * 0.3;
          
          for (let i = 0; i < buildingCount; i++) {
            const width = 20 + Math.random() * 30;
            const height = 50 + Math.random() * maxHeight;
            const hasSpire = Math.random() > 0.8;
            const spireHeight = hasSpire ? height * 0.2 : 0;
            
            buildings.push({
              x: i * (canvas.width / buildingCount),
              width: width,
              height: height,
              hasSpire: hasSpire,
              spireHeight: spireHeight,
              windows: Math.floor(Math.random() * 5) + 2
            });
          }
        }
      };
      
      // Create clouds for sky
      const createClouds = () => {
        if (clouds.length === 0) {
          const cloudCount = 5;
          for (let i = 0; i < cloudCount; i++) {
            clouds.push({
              x: Math.random() * canvas.width,
              y: canvas.height * (0.1 + Math.random() * 0.2),
              radius: 30 + Math.random() * 20,
              speed: 0.2 + Math.random() * 0.3,
              segments: Math.floor(Math.random() * 3) + 3
            });
          }
        }
      };
      
      // Create birds
      const createBirds = () => {
        if (birds.length === 0) {
          const birdCount = 10;
          for (let i = 0; i < birdCount; i++) {
            birds.push({
              x: Math.random() * canvas.width,
              y: canvas.height * (0.1 + Math.random() * 0.3),
              size: 3 + Math.random() * 5,
              speed: 0.5 + Math.random() * 1.5,
              wingPhase: Math.random() * Math.PI * 2,
              wingSpeed: 0.1 + Math.random() * 0.2
            });
          }
        }
      };
      
      // Create bubbles (for final scene)
      const createBubbles = () => {
        if (bubbles.length === 0) {
          const bubbleCount = 30;
          for (let i = 0; i < bubbleCount; i++) {
            bubbles.push({
              x: Math.random() * canvas.width,
              y: canvas.height + Math.random() * 50, // Start below canvas
              radius: 5 + Math.random() * 15,
              speed: 0.5 + Math.random() * 1.5,
              color: `rgba(255, 255, 255, ${0.2 + Math.random() * 0.3})`,
              wobblePhase: Math.random() * Math.PI * 2,
              wobbleSpeed: 0.02 + Math.random() * 0.05,
              wobbleAmount: 0.5 + Math.random() * 1.5
            });
          }
        }
      };
      
      // Draw a star
      const drawStar = (star, time) => {
        ctx.fillStyle = star.color;
        
        if (star.twinkle) {
          ctx.globalAlpha = 0.5 + Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.5;
        } else {
          ctx.globalAlpha = 1;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // For larger stars, add a cross glow
        if (star.size > 2) {
          const halfGlow = star.size * 2;
          
          ctx.globalAlpha = 0.2;
          ctx.beginPath();
          ctx.moveTo(star.x - halfGlow, star.y);
          ctx.lineTo(star.x + halfGlow, star.y);
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 1;
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(star.x, star.y - halfGlow);
          ctx.lineTo(star.x, star.y + halfGlow);
          ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
      };
      
      // Draw the sun
      const drawSun = (scene, time) => {
        const colors = sceneColors[scene.name].sun;
        
        if (!colors) return;
        
        // Position depends on the scene
        let sunProgress = 0;
        let baseY = 0;
        
        if (scene.name === "dawn") {
          // Sun rising
          sunProgress = scene.normalizedProgress;
          baseY = canvas.height * 0.7;
        } else if (scene.name === "day" || scene.name === "complete") {
          // Sun high in the sky
          sunProgress = 1;
          baseY = canvas.height * 0.7;
        }
        
        const sunRadius = canvas.width * 0.07;
        const sunX = canvas.width * 0.7;
        const sunY = baseY - (canvas.height * 0.5 * sunProgress);
        
        // Glow
        const gradient = ctx.createRadialGradient(
          sunX, sunY, sunRadius * 0.8,
          sunX, sunY, sunRadius * 2
        );
        gradient.addColorStop(0, colors.outer);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Sun body
        const sunGradient = ctx.createRadialGradient(
          sunX - sunRadius * 0.3, sunY - sunRadius * 0.3, 0,
          sunX, sunY, sunRadius
        );
        sunGradient.addColorStop(0, colors.inner);
        sunGradient.addColorStop(1, colors.outer);
        
        ctx.globalAlpha = 1;
        ctx.fillStyle = sunGradient;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Sun rays (for day scene)
        if ((scene.name === "day" || scene.name === "complete") && scene.normalizedProgress > 0.5) {
          const rayCount = 12;
          const innerRadius = sunRadius * 0.9;
          const outerRadius = sunRadius * 1.5;
          
          ctx.strokeStyle = colors.outer;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.6;
          
          for (let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2 + time * 0.2;
            
            ctx.beginPath();
            ctx.moveTo(
              sunX + Math.cos(angle) * innerRadius,
              sunY + Math.sin(angle) * innerRadius
            );
            ctx.lineTo(
              sunX + Math.cos(angle) * outerRadius,
              sunY + Math.sin(angle) * outerRadius
            );
            ctx.stroke();
          }
          
          ctx.globalAlpha = 1;
        }
      };
      
      // Draw a cloud
      const drawCloud = (cloud, time, speed) => {
        ctx.fillStyle = sceneColors.day.clouds;
        
        // Move the cloud
        cloud.x += cloud.speed * speed;
        if (cloud.x > canvas.width + cloud.radius * 2) {
          cloud.x = -cloud.radius * 2;
        }
        
        // Draw cloud segments
        const baseY = cloud.y;
        const baseRadius = cloud.radius;
        
        // Draw main segments
        for (let i = 0; i < cloud.segments; i++) {
          const offsetX = i * (baseRadius * 0.8) - ((cloud.segments - 1) * (baseRadius * 0.4));
          const offsetY = Math.sin(i * 1.5) * (baseRadius * 0.2);
          const radius = baseRadius * (0.7 + Math.sin(i * 0.5) * 0.3);
          
          ctx.beginPath();
          ctx.arc(cloud.x + offsetX, baseY + offsetY, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      
      // Draw a bird
      const drawBird = (bird, time) => {
        ctx.fillStyle = '#000000';
        
        // Move the bird
        bird.x += bird.speed;
        if (bird.x > canvas.width + bird.size * 5) {
          bird.x = -bird.size * 5;
        }
        
        // Wing flapping animation
        const wingPosition = Math.sin(time * bird.wingSpeed + bird.wingPhase);
        
        // Draw bird body (simplified M shape)
        ctx.beginPath();
        
        // Left wing
        ctx.moveTo(bird.x - bird.size * 2, bird.y + wingPosition * bird.size * 2);
        ctx.lineTo(bird.x, bird.y);
        
        // Right wing
        ctx.lineTo(bird.x + bird.size * 2, bird.y + wingPosition * bird.size * 2);
        
        ctx.stroke();
      };
      
      // Draw buildings
      const drawBuildings = (scene) => {
        // Calculate building color based on scene
        let buildingColor;
        
        if (scene.name === "night") {
          buildingColor = '#111111';
        } else if (scene.name === "dawn") {
          // Transition from dark to silhouette
          const blendFactor = scene.normalizedProgress;
          const r = Math.floor(17 + blendFactor * (30 - 17));
          const g = Math.floor(17 + blendFactor * (30 - 17));
          const b = Math.floor(17 + blendFactor * (60 - 17));
          buildingColor = `rgb(${r}, ${g}, ${b})`;
        } else {
          // Day - silhouette effect
          buildingColor = '#203060';
        }
        
        // Draw each building
        buildings.forEach(building => {
          // Building body
          ctx.fillStyle = buildingColor;
          ctx.fillRect(
            building.x, 
            canvas.height * 0.7 - building.height, 
            building.width, 
            building.height
          );
          
          // Windows (only visible at night or dawn)
          if (scene.name === "night" || scene.name === "dawn") {
            const windowWidth = building.width / 3;
            const windowHeight = building.height / (building.windows + 1);
            const windowColor = scene.name === "night" ? '#FFEB3B' : '#FFF9C4';
            
            ctx.fillStyle = windowColor;
            
            // Random window pattern
            for (let row = 0; row < building.windows; row++) {
              for (let col = 0; col < 2; col++) {
                // Only draw some windows (randomly)
                if (Math.random() > 0.4) {
                  ctx.fillRect(
                    building.x + col * windowWidth + windowWidth / 2,
                    canvas.height * 0.7 - building.height + (row + 1) * windowHeight,
                    windowWidth * 0.6,
                    windowHeight * 0.6
                  );
                }
              }
            }
          }
          
          // Building spire
          if (building.hasSpire) {
            ctx.beginPath();
            ctx.moveTo(building.x + building.width / 2, canvas.height * 0.7 - building.height - building.spireHeight);
            ctx.lineTo(building.x, canvas.height * 0.7 - building.height);
            ctx.lineTo(building.x + building.width, canvas.height * 0.7 - building.height);
            ctx.closePath();
            ctx.fillStyle = buildingColor;
            ctx.fill();
          }
        });
      };
      
      // Draw bubbles for the final effect
      const drawBubbles = (time, deltaTime) => {
        bubbles.forEach(bubble => {
          // Move bubble upward
          bubble.y -= bubble.speed;
          
          // Horizontal wobble
          bubble.x += Math.sin(time * bubble.wobbleSpeed + bubble.wobblePhase) * bubble.wobbleAmount;
          
          // Reset when off the top
          if (bubble.y < -bubble.radius * 2) {
            bubble.y = canvas.height + bubble.radius;
            bubble.x = Math.random() * canvas.width;
          }
          
          // Draw bubble
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
          ctx.fillStyle = bubble.color;
          ctx.fill();
          
          // Highlight
          ctx.beginPath();
          ctx.arc(
            bubble.x - bubble.radius * 0.3,
            bubble.y - bubble.radius * 0.3,
            bubble.radius * 0.2,
            0, Math.PI * 2
          );
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
        });
      };
      
      // Draw a shooting star
      const drawShootingStar = (scene, time) => {
        if (scene.name !== "night" && scene.name !== "dawn") return;
        
        // Only draw at specific times
        const cycleTime = time % 3000 / 3000;
        
        if (cycleTime < 0.2) {
          const length = canvas.width * 0.15;
          const progress = cycleTime / 0.2;
          
          const x1 = canvas.width * 0.2 + progress * canvas.width * 0.6;
          const y1 = canvas.height * 0.2 + progress * canvas.height * 0.2;
          const x2 = x1 - length;
          const y2 = y1 - length;
          
          // Tail
          const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Head
          ctx.beginPath();
          ctx.arc(x1, y1, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        }
      };
      
      // Draw sparkles (for final scene)
      const drawSparkles = (scene, time) => {
        if (scene.name !== "complete") return;
        
        const sparkleColors = sceneColors.complete.sparkle;
        const sparkleCount = 20;
        
        for (let i = 0; i < sparkleCount; i++) {
          const angle = (i / sparkleCount) * Math.PI * 2;
          const oscillation = Math.sin(time * 0.005 + i * 0.5);
          
          const radius = canvas.width * 0.3 * (0.8 + oscillation * 0.2);
          const x = canvas.width / 2 + Math.cos(angle + time * 0.001) * radius;
          const y = canvas.height / 2 + Math.sin(angle + time * 0.001) * radius;
          
          const size = 2 + Math.sin(time * 0.01 + i) * 2;
          
          // Sparkle shape (star)
          ctx.fillStyle = sparkleColors[i % sparkleColors.length];
          ctx.globalAlpha = 0.7 + oscillation * 0.3;
          
          // Simple sparkle as a circle with varying size
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.globalAlpha = 1;
        }
      };
      
      // Draw progress message
      const drawProgressMessage = (scene, progress) => {
        // Different messages for different scenes
        let message;
        if (scene.name === "night") {
          message = "Starting Search...";
        } else if (scene.name === "dawn") {
          message = "Finding Information...";
        } else if (scene.name === "day") {
          message = "Generating Content...";
        } else {
          message = "Almost Ready...";
        }
        
        // Progress bar
        const barWidth = canvas.width * 0.7;
        const barHeight = 8;
        const barX = (canvas.width - barWidth) / 2;
        const barY = canvas.height * 0.9;
        
        // Bar background and border
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
        
        // Bar fill - gradient based on scene
        let gradient;
        if (scene.name === "night") {
          gradient = ctx.createLinearGradient(barX, barY, barX + barWidth * progress, barY);
          gradient.addColorStop(0, '#3E5151');
          gradient.addColorStop(1, '#DECBA4');
        } else if (scene.name === "dawn") {
          gradient = ctx.createLinearGradient(barX, barY, barX + barWidth * progress, barY);
          gradient.addColorStop(0, '#614385');
          gradient.addColorStop(1, '#516395');
        } else {
          gradient = ctx.createLinearGradient(barX, barY, barX + barWidth * progress, barY);
          gradient.addColorStop(0, '#11998e');
          gradient.addColorStop(1, '#38ef7d');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(barX, barY, barWidth * progress, barHeight);
        
        // Text message
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(message, canvas.width / 2, canvas.height * 0.85);
        
        // Percentage
        ctx.font = '14px Arial';
        ctx.fillText(`${Math.round(progress * 100)}%`, canvas.width / 2, canvas.height * 0.95);
      };
      
      // Main animation loop
      const draw = (timestamp) => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get current scene
        const scene = getCurrentScene(drawingProgress);
        const colors = sceneColors[scene.name];
        
        // Draw sky gradient
        const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.7);
        skyGradient.addColorStop(0, colors.bg.top);
        skyGradient.addColorStop(1, colors.bg.bottom);
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);
        
        // Draw ground gradient
        const groundGradient = ctx.createLinearGradient(0, canvas.height * 0.7, 0, canvas.height);
        groundGradient.addColorStop(0, colors.ground.top);
        groundGradient.addColorStop(1, colors.ground.bottom);
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
        
        // Only proceed with scene-specific drawing if we have some progress
        if (drawingProgress > 0) {
          // Night scene elements
          if (scene.name === "night") {
            // Create stars based on progress (more stars as we progress)
            const starCount = Math.floor(200 * scene.normalizedProgress);
            createStars(scene, starCount);
            
            // Draw each star
            stars.forEach(star => drawStar(star, timestamp / 1000));
            
            // Draw shooting star
            drawShootingStar(scene, timestamp);
            
            // Create and draw buildings (city silhouette)
            createBuildings();
            drawBuildings(scene);
          }
          
          // Dawn scene elements
          else if (scene.name === "dawn") {
            // Fade out stars gradually
            const starCount = Math.floor(200 * (1 - scene.normalizedProgress));
            if (stars.length > starCount) {
              stars.length = starCount;
            }
            
            // Draw remaining stars with fading effect
            stars.forEach(star => {
              ctx.globalAlpha = 1 - scene.normalizedProgress;
              drawStar(star, timestamp / 1000);
              ctx.globalAlpha = 1;
            });
            
            // Draw the rising sun
            drawSun(scene, timestamp / 1000);
            
            // Draw shooting star (less frequent)
            if (Math.random() > 0.7) {
              drawShootingStar(scene, timestamp);
            }
            
            // Draw buildings
            drawBuildings(scene);
            
            // Add birds as day approaches
            if (scene.normalizedProgress > 0.7) {
              createBirds();
              birds.forEach(bird => drawBird(bird, timestamp / 1000));
            }
          }
          
          // Day scene elements
          else if (scene.name === "day") {
            // Draw sun
            drawSun(scene, timestamp / 1000);
            
            // Create and draw clouds
            createClouds();
            clouds.forEach(cloud => drawCloud(cloud, timestamp / 1000, scene.normalizedProgress));
            
            // Create and draw birds
            createBirds();
            birds.forEach(bird => drawBird(bird, timestamp / 1000));
            
            // Create and draw buildings
            drawBuildings(scene);
          }
          
          // Final scene elements
          else if (scene.name === "complete") {
            // Draw sun
            drawSun(scene, timestamp / 1000);
            
            // Draw clouds with faster movement
            clouds.forEach(cloud => drawCloud(cloud, timestamp / 1000, 2));
            
            // Draw birds
            birds.forEach(bird => drawBird(bird, timestamp / 1000));
            
            // Draw buildings
            drawBuildings(scene);
            
            // Draw sparkles
            drawSparkles(scene, timestamp);
            
            // Create and draw rising bubbles
            createBubbles();
            drawBubbles(timestamp / 1000);
          }
        }
        
        // Always draw progress message
        drawProgressMessage(scene, drawingProgress);
        
        // Request next frame if still loading
        if (isLoading) {
          animationFrameRef.current = requestAnimationFrame(draw);
        }
      };
      
      // Start the animation
      animationFrameRef.current = requestAnimationFrame(draw);
      
      // Cleanup on unmount
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isLoading, drawingProgress]);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setDrawingProgress(0);
    setDrawingCompleted(false);
    setSearchResults(null);
    
    try {
      console.log(`Searching for: ${searchQuery}`);
      const response = await fetchAreaInfo(searchQuery);
      
      // Generate random weather data
      const currentDate = new Date();
      const hours = currentDate.getHours();
      let temp, conditions;
        
      // Change weather based on time of day
      if (hours >= 6 && hours < 12) {
        temp = Math.floor(22 + Math.random() * 5);
        conditions = "Partly Cloudy";
      } else if (hours >= 12 && hours < 18) {
        temp = Math.floor(28 + Math.random() * 5);
        conditions = "Sunny";
      } else {
        temp = Math.floor(18 + Math.random() * 5);
        conditions = "Clear";
      }
      
      const weatherData = {
        temperature: temp,
        conditions: conditions,
        humidity: Math.floor(60 + Math.random() * 20),
        windSpeed: Math.floor(5 + Math.random() * 10)
      };
      
      // Check if API returned actual data or an error message
      if (response && response.description && !response.description.includes('unavailable') && !response.description.includes('Sorry')) {
        // Use API data as is, but add weather and ensure location structure
        setSearchResults({
          ...response,
          weather: weatherData,
          location: {
            name: response.location?.name || searchQuery,
            description: response.description,
            formattedAddress: `${searchQuery}, Bangalore, Karnataka, India`
          }
        });
      } else {
        // Only use default content if API failed to return meaningful data
        console.log('Using default content due to insufficient API response');
        const enrichedResponse = {
          weather: weatherData,
          location: {
            name: searchQuery,
            description: defaultDescriptions.location,
            formattedAddress: `${searchQuery}, Bangalore, Karnataka, India`
          },
          places: defaultDescriptions.places,
          restaurants: defaultDescriptions.restaurants,
          accommodations: defaultDescriptions.accommodations
        };
        
        setSearchResults(enrichedResponse);
      }
    } catch (err) {
      setError("Sorry, we couldn't find information about that location. Please try another search.");
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderWeather = () => {
    if (!searchResults || !searchResults.weather) return null;
    
    return (
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-t-lg">
          <h3 className="text-xl font-semibold">Current Weather</h3>
        </div>
        <div className="bg-gradient-to-b from-blue-50 to-white rounded-b-lg shadow-md p-4">
          <div className="flex flex-wrap items-center">
            <div className="mr-4">
              <span className="text-4xl font-bold text-blue-700">{searchResults.weather.temperature}°C</span>
            </div>
            <div className="flex-1">
              <p className="text-lg font-medium text-blue-800">{searchResults.weather.conditions}</p>
              <div className="flex flex-wrap mt-2">
                <div className="mr-4">
                  <span className="text-sm text-gray-600">Humidity:</span>
                  <span className="ml-1 text-sm font-medium text-blue-700">{searchResults.weather.humidity}%</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Wind:</span>
                  <span className="ml-1 text-sm font-medium text-blue-700">{searchResults.weather.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderDirections = () => {
    if (!searchResults || !searchResults.location || !searchResults.location.formattedAddress) return null;
    
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${searchQuery}, Bangalore, India`)}`;
    
    return (
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-t-lg">
          <h3 className="text-xl font-semibold">Directions</h3>
        </div>
        <div className="bg-white rounded-b-lg shadow-md p-4">
          <p className="text-gray-700 mb-3">{searchResults.location.formattedAddress}</p>
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    );
  };

  const renderMap = () => {
    const mapSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDCDqpBvbPvIFPp0zZ-tMwE_I-KoCcLY60&q=${encodeURIComponent(`${searchQuery}, Bangalore, India`)}`;
    
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Apply custom CSS */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          AI-Powered Bangalore Guide
        </span>
      </h1>
      
      <div className="max-w-3xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Search for places in Bangalore (e.g., CMR University, Indiranagar, etc.)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : (
              "Search"
            )}
          </button>
        </form>
      </div>
      
      {isLoading && !drawingCompleted && (
        <div className="flex flex-col items-center justify-center space-y-8 py-12">
          <canvas ref={canvasRef} className="w-full h-64 bg-white rounded-lg shadow-md"></canvas>
        </div>
      )}
      
      {!isLoading && searchResults && (
        <div className="mt-6 max-w-4xl mx-auto">
          {searchResults && (
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-5 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {searchResults.location?.name || searchQuery}
              </h2>
              <p className="text-white opacity-90">
                {searchResults.location?.description || searchResults.description}
              </p>
            </div>
          )}
          
          {/* Weather Information */}
          {(searchResults && searchResults.weather) && (
            <div>
              {renderWeather()}
            </div>
          )}
          
          {/* Directions */}
          {renderDirections()}
          
          {/* Map */}
          {/* Map component removed as requested */}
          
          {/* Places to Visit */}
          {searchResults && searchResults.places && searchResults.places.length > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-4 rounded-t-lg">
                <h3 className="text-xl font-semibold">Places to Visit</h3>
              </div>
              <div className="bg-white rounded-b-lg shadow-md divide-y divide-gray-100">
                {searchResults.places.map((place, index) => (
                  <div key={index} className="p-4">
                    <h4 className="font-bold text-lg text-pink-700">{place.name}</h4>
                    <p className="text-gray-700 mt-1">{place.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Restaurants */}
          {searchResults && searchResults.restaurants && searchResults.restaurants.length > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-t-lg">
                <h3 className="text-xl font-semibold">Popular Restaurants</h3>
              </div>
              <div className="bg-white rounded-b-lg shadow-md divide-y divide-gray-100">
                {searchResults.restaurants.map((restaurant, index) => (
                  <div key={index} className="p-4">
                    <h4 className="font-bold text-lg text-orange-600">{restaurant.name}</h4>
                    <p className="text-gray-700 mt-1">{restaurant.description}</p>
                    <div className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-xs inline-block mt-2">
                      {restaurant.cuisine}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Accommodations */}
          {searchResults && searchResults.accommodations && searchResults.accommodations.length > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-lg">
                <h3 className="text-xl font-semibold">Where to Stay</h3>
              </div>
              <div className="bg-white rounded-b-lg shadow-md divide-y divide-gray-100">
                {searchResults.accommodations.map((hotel, index) => (
                  <div key={index} className="p-4">
                    <h4 className="font-bold text-lg text-purple-700">{hotel.name}</h4>
                    <p className="text-gray-700 mt-1">{hotel.description}</p>
                    <div className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs inline-block mt-2">
                      {hotel.priceRange}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AISearch;
