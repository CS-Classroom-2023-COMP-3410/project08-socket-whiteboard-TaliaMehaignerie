document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('whiteboard');
  const context = canvas.getContext('2d');
  const colorInput = document.getElementById('color-input');
  const brushSizeInput = document.getElementById('brush-size');
  const brushSizeDisplay = document.getElementById('brush-size-display');
  const clearButton = document.getElementById('clear-button');
  const connectionStatus = document.getElementById('connection-status');
  const userCount = document.getElementById('user-count');

  function resizeCanvas() {
    // TODO: Set the canvas width and height based on its parent element
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    // Redraw the canvas with the current board state when resized
    // TODO: Call redrawCanvas() function
    redrawCanvas();
  }

  // Initialize canvas size
  // TODO: Call resizeCanvas()
  resizeCanvas();

  // Handle window resize
  // TODO: Add an event listener for the 'resize' event that calls resizeCanvas

  // Drawing variables
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // Connect to Socket.IO server
  // TODO: Create a socket connection to the server at 'http://localhost:3000'
  //const io = require('socket.io-client');
  const socket = io.connect('http://localhost:3000');
  socket.on('connect', () => {
    console.log('Connected to the server');
    connectionStatus.innerHTML = "Connected";

    socket.on('clear', () => {
      console.log("Clear command received");
      context.clearRect(0, 0, canvas.width, canvas.height);
    });
    socket.on('draw', (drawData) => {
      console.log("draw command received");
      drawLine(drawData.lastX, drawData.lastY, drawData.currX, drawData.currY, drawData.color, drawData.brushSize)
    });
    socket.on('currentUsers', (currentUsers) => {
      console.log("currentUsers received");
      userCount.innerHTML = currentUsers;
      
    });
    
    socket.on('disconnect', () => {
      console.log();
      socket.disconnect();
    });
  });

  // TODO: Set up Socket.IO event handlers


  // Canvas event handlers
  // mousedown: start drawing when user presses mouse button
  canvas.addEventListener('mousedown', e => {
    const x = e.offsetX;
    const y = e.offsetY;
    console.log(`Mouse down at (${x}, ${y})`);
    startDrawing(e);
  });

  // mouseup: Stop drawing when user releases mouse button
  canvas.addEventListener('mouseup', e => {
    const x = e.offsetX;
    const y = e.offsetY;
    console.log(`Mouse up at (${x}, ${y})`);
    stopDrawing();
  });

  // mousemove: Draw lines as user moves mouse (while button pressed)
  canvas.addEventListener('mousemove', e => {
    draw(e);
  });

  // mousemove: Draw lines as user moves mouse (while button pressed)
  canvas.addEventListener('mouseout', e => {
    stopDrawing();
  });


  // Touch support (optional)
  // TODO: Add event listeners for touch events (touchstart, touchmove, touchend, touchcancel)

  // Clear button event handler
  // TODO: Add event listener for the clear button
  clearButton.addEventListener("click", e => {
    console.log(`Canvas Cleared`);
    clearCanvas();
  });

  // Update brush size display
  // TODO: Add event listener for brush size input changes
  brushSizeInput.addEventListener("click", e => {
    console.log(`Brush Size changed to ${brushSizeInput.value}`);
    brushSizeDisplay.innerHTML = brushSizeInput.value;
  });


  function startDrawing(e) {
    // TODO: Set isDrawing to true 
    isDrawing = true;

    // TODO: capture initial coordinates
    const coords = getCoordinates(e);
    lastX = coords.x;
    lastY = coords.y;

  }

  function draw(e) {
    // TODO: If not drawing, return
    if (isDrawing == false) {
      return
    }

    else {
      // TODO: Get current coordinates
      const currCoords = getCoordinates(e);

      const drawData = {
        lastX: lastX, 
        lastY: lastY, 
        currX: currCoords.x, 
        currY: currCoords.y, 
        color: colorInput.value, 
        brushSize: brushSizeInput.value
      };

      // TODO: Emit 'draw' event to the server with drawing data
      socket.emit('draw', drawData);
      drawLine(lastX, lastY, currCoords.x, currCoords.y, colorInput.value, brushSizeInput.value)

      // TODO: Update last position
      lastX = currCoords.x;
      lastY = currCoords.y;
    }

  }

  function drawLine(x0, y0, x1, y1, color, size) {
    // TODO: Draw a line on the canvas using the provided parameters
    // Start a new path
    context.beginPath();
    // Move to starting point
    context.moveTo(x0, y0);
    // Draw a line to another point
    context.lineTo(x1, y1);
    // Set line color and width
    context.strokeStyle = color;
    context.lineWidth = size;
    // Render the path
    context.stroke();
  }

  function stopDrawing() {
    // TODO: Set isDrawing to false
    isDrawing = false;
  }

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // TODO: Emit 'clear' event to the server
    socket.emit('clear');

  }

  function redrawCanvas(boardState = []) {
    // TODO: Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // TODO: Redraw all lines from the board state
  }

  // Helper function to get coordinates from mouse or touch event
  // NOTE: not my code. Whole function copy and pasted from the slides 
  function getCoordinates(e) {
    if (e.type.includes('touch')) {// Get first touch point
      const touch = e.touches[0] || e.changedTouches[0];
      // Get canvas position
      const rect = canvas.getBoundingClientRect();
      // Calculate coordinates relative to canvas
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {// Mouse event
      return {
        x: e.offsetX,
        y: e.offsetY
      };
    }
  }

  // Handle touch events
  function handleTouchStart(e) {
    // TODO: Prevent default behavior and call startDrawing
  }

  function handleTouchMove(e) {
    // TODO: Prevent default behavior and call draw
  }
});
