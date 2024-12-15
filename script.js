// Handle SOS Button on all pages
document.addEventListener('DOMContentLoaded', () => {
    const sosButton = document.getElementById('sosButton');
    const messageDiv = document.getElementById('message');

    sosButton.addEventListener('click', function() {
        // Step 1: Try to fetch the user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                alert(`Location fetched: Latitude: ${latitude}, Longitude: ${longitude}`);
                
                // Proceed with sending the SOS
                sendSOSMessage(latitude, longitude);
            }, function(error) {
                // Location fetching failed (no permission, etc.)
                alert('Location permission not granted. Attempting fallback actions.');
                
                // Step 2: Fallback actions if location is unavailable
                handleNoLocation();
            });
        } else {
            alert('Geolocation is not supported by this browser.');
            handleNoLocation();
        }
    });

    // Function to send SOS message with location
    function sendSOSMessage(latitude, longitude) {
        const message = `Emergency! I am at latitude: ${latitude}, longitude: ${longitude}. Please help!`;

        // Simulate sending the message to emergency contacts
        sendSMS('+917872772196', message);  // Replace with actual phone number
        messageDiv.innerHTML = "SOS alert sent successfully!";
    }

    // Function to handle the case where location permission is not granted
    function handleNoLocation() {
        // Step 3: If location is unavailable, use pre-set emergency contacts or address
        const predefinedMessage = "Emergency! Location not available, but I need immediate assistance!";
        
        // Option 1: Send to emergency contact with default message
        sendSMS('+917872772196', predefinedMessage); // Emergency contact's number

        // Option 2: Call emergency services automatically (if supported)
        callEmergencyServices();

        // Option 3: Allow voice-based or manual alerts if available
        promptForEmergencyHelp();

        messageDiv.innerHTML = "SOS alert sent with predefined location.";
    }

    // Function to send SMS (replace with actual SMS API)
    function sendSMS(phone, message) {
        alert(`Sending SMS to ${phone}: ${message}`);
        // Actual SMS sending logic
    }

    // Function to automatically call emergency services (replace with actual service call)
    function callEmergencyServices() {
        alert("Calling emergency services...");
        // Code to call 911 or emergency services (if possible)
    }

    // Function to prompt user for manual input if voice command is not available
    function promptForEmergencyHelp() {
        const helpNeeded = confirm("Are you in immediate danger? Press OK for help.");
        if (helpNeeded) {
            sendSMS('+917872772196', "Emergency! Please send help.");
        }
    }
});

// Login Form Handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (email && password) {
            alert("Login successful!");
            // Add further login validation here
        } else {
            alert("Please fill in all fields!");
        }
    });
}
function openTab(event, role) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach((content) => {
        content.classList.remove("active");
    });

    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach((button) => {
        button.classList.remove("active");
    });

    // Show the selected tab and add active class to the selected button
    document.getElementById(role).classList.add("active");
    event.currentTarget.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".tab-button").click();

    document.querySelectorAll(".signup-form").forEach(form => {
        form.addEventListener("submit", function(event) {
            const password = form.querySelector("input[type='password']");
            const confirmPassword = form.querySelector("input[name$='confirm-password']");
            if (password.value !== confirmPassword.value) {
                event.preventDefault();
                alert("Passwords do not match. Please try again.");
                confirmPassword.focus();
            }
        });
    });
});

/*
function Map(mapId, latInputId, lngInputId) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let userLat = position.coords.latitude;
            let userLng = position.coords.longitude;

            // Initialize the map
            /*let map = L.map(mapId).setView([userLat, userLng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);*/

            // Add a draggable marker at the current location
  /*          let marker = L.marker([userLat, userLng], { draggable: true }).addTo(map);

            // Set hidden input values to initial position
            document.getElementById(latInputId).value = userLat;
            document.getElementById(lngInputId).value = userLng;

            // Update input values on marker drag
            marker.on('dragend', function (event) {
                let position = marker.getLatLng();
                document.getElementById(latInputId).value = position.lat;
                document.getElementById(lngInputId).value = position.lng;
            });

            // Update marker position on map click
            map.on('click', function (event) {
                let position = event.latlng;
                marker.setLatLng(position);
                document.getElementById(latInputId).value = position.lat;
                document.getElementById(lngInputId).value = position.lng;
            });
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Initialize maps for Doctor and Hospital tabs
document.addEventListener("DOMContentLoaded", function () {
    Map("map-doctor", "doctor-lat", "doctor-lng");
    Map("map-hospital", "hospital-lat", "hospital-lng");
});*/

// Common initialization for all pages
document.addEventListener("DOMContentLoaded", function () {
    // Run page-specific initializations
    initializeMapIfNeeded();
});

// Check if the map should be initialized
function initializeMapIfNeeded() {
    // Detect if we are on the signup page
    const isSignupPage = document.querySelector(".signup-container");
    if (isSignupPage) {
        setupDoctorMap();
        setupHospitalMap();
    }
}

// Function to initialize Map My India map for doctors
function setupDoctorMap() {
    // Map container, latitude, and longitude input fields for doctors
    const mapContainerId = "map-doctor";
    const latInputId = "doctor-lat";
    const lngInputId = "doctor-lng";
    
    // Check if the doctor map container exists on the page
    if (document.getElementById(mapContainerId)) {
        initializeMap(mapContainerId, latInputId, lngInputId);
    }
}

// Function to initialize Map My India map for hospitals
function setupHospitalMap() {
    // Map container, latitude, and longitude input fields for hospitals
    const mapContainerId = "map-hospital";
    const latInputId = "hospital-lat";
    const lngInputId = "hospital-lng";
    
    // Check if the hospital map container exists on the page
    if (document.getElementById(mapContainerId)) {
        initializeMap(mapContainerId, latInputId, lngInputId);
    }
}

// Function to initialize the map and place a draggable marker
function initializeMap(mapElementId, latInputId, lngInputId) {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Initialize Map My India map centered on user's location
            const map = new MapmyIndia.Map(mapElementId, {
                center: [lat, lng],
                zoomControl: true,
                hybrid: false
            });

            // Add a draggable marker at the initial location
            const marker = new L.marker([lat, lng], { draggable: true }).addTo(map);

            // Set initial coordinates in hidden input fields
            document.getElementById(latInputId).value = lat;
            document.getElementById(lngInputId).value = lng;

            // Update coordinates in hidden fields when marker is dragged
            marker.on('dragend', function (event) {
                const newLatLng = event.target.getLatLng();
                document.getElementById(latInputId).value = newLatLng.lat;
                document.getElementById(lngInputId).value = newLatLng.lng;
            });
        },
        function (error) {
            console.error("Geolocation failed: " + error.message);
        }
    );
}

function toggleMenu() {
    const menu = document.querySelector('.navbar ul.menu');
    menu.classList.toggle('mobile-menu');
}

