const riderBtn = document.getElementById("riderBtn");
const driverBtn = document.getElementById("driverBtn");

const riderForm = document.getElementById("riderForm");
const driverForm = document.getElementById("driverForm");
const availableRides = document.getElementById("availableRides");
const ridesList = document.getElementById("ridesList");

const riderInfoSection = document.getElementById("riderInfoSection");

let availableRideData = [];
let editingRideIndex = null;  // Track the ride being edited

// Toggle between Rider and Driver views
riderBtn.addEventListener("click", () => {
    riderForm.style.display = "block";
    driverForm.style.display = "none";
    riderInfoSection.style.display = "none";  // Hide the rider info section when switching to Rider
});

driverBtn.addEventListener("click", () => {
    driverForm.style.display = "block";
    riderForm.style.display = "none";
    riderInfoSection.style.display = "none";  // Hide the rider info section when switching to Driver
});

// Handle Rider form submission (Add or Update Ride)
document.getElementById("riderFormElement").addEventListener("submit", function (e) {
    e.preventDefault();
    const riderName = document.getElementById("riderName").value;
    const pickupLocation = document.getElementById("pickupLocation").value;
    const destination = document.getElementById("destination").value;
    const riderPhone = document.getElementById("riderPhone").value;

    const newRide = {
        riderName,
        pickupLocation,
        destination,
        riderPhone,
        status: "available",
        phoneUnlocked: false
    };

    if (editingRideIndex === null) {
        availableRideData.push(newRide);  // Add new ride
    } else {
        availableRideData[editingRideIndex] = newRide;  // Update existing ride
        editingRideIndex = null;  // Reset editing mode
    }

    alert("Your ride has been submitted!");

    // Clear the form
    document.getElementById("riderFormElement").reset();

    // Display the updated available rides and rider info
    displayAvailableRides();
    displayRiderInfo(newRide);
});

// Handle Driver form submission
document.getElementById("driverFormElement").addEventListener("submit", function (e) {
    e.preventDefault();
    const driverName = document.getElementById("driverName").value;
    alert(`Hello ${driverName}, here are the available rides!`);
    displayAvailableRides();
});

// Display available rides for drivers
function displayAvailableRides() {
    availableRides.style.display = "block";
    ridesList.innerHTML = "";

    availableRideData.forEach((ride, index) => {
        const rideItem = document.createElement("li");
        rideItem.innerHTML = `
            <strong>${ride.riderName}</strong><br>
            Pickup: ${ride.pickupLocation}<br>
            Destination: ${ride.destination}<br>
            ${ride.status === "unavailable" ? 
                (ride.phoneUnlocked ? 
                    `Phone: ${ride.riderPhone}<br>` :
                    `<button onclick="unlockPhoneNumber(${index})">Unlock Phone Number</button><br>`) :
                ''}
            <button class="message" onclick="openWhatsApp('${ride.riderPhone}')">Message</button>
            <button class="call" onclick="callRider('${ride.riderPhone}')">Call</button>
            <button onclick="selectRide(${index})" ${ride.status === "unavailable" ? "disabled" : ""}>Select Ride</button>
            <button onclick="editRide(${index})">Edit</button>
            <button onclick="deleteRide(${index})">Delete</button>
        `;
        ridesList.appendChild(rideItem);
    });
}

// Display the rider's own submitted ride information
function displayRiderInfo(ride) {
    riderInfoSection.style.display = "block";
    riderInfoSection.innerHTML = `
        <h3>Your Submitted Ride Information:</h3>
        <strong>${ride.riderName}</strong><br>
        Pickup: ${ride.pickupLocation}<br>
        Destination: ${ride.destination}<br>
        Phone: ${ride.riderPhone}<br>
        <button onclick="editRide(${availableRideData.length - 1})">Edit</button>
        <button onclick="deleteRide(${availableRideData.length - 1})">Delete</button>
    `;
}

// Mark ride as selected and unavailable
function selectRide(index) {
    const selectedRide = availableRideData[index];
    
    // Mark the selected ride as unavailable
    selectedRide.status = "unavailable";
    
    // Hide the rider's phone number and add a prompt for the driver's name to unlock it
    selectedRide.phoneUnlocked = false;
    
    // Alert the driver that the ride has been selected
    alert("Ride selected! You can now contact the rider after unlocking the phone number.");

    // Refresh the available rides list to reflect the updated status
    displayAvailableRides();
}

// Function to unlock the rider's phone number by entering the driver's name
function unlockPhoneNumber(index) {
    const driverName = prompt("Please enter your name to unlock the rider's phone number:");
    const selectedRide = availableRideData[index];

    if (driverName === selectedRide.driverName) {
        selectedRide.phoneUnlocked = true;  // Unlock the phone number
        alert("Phone number unlocked!");
    } else {
        alert("Incorrect name. You cannot unlock the phone number.");
    }

    // Refresh the available rides list to reflect the unlocked phone number
    displayAvailableRides();
}

// Open WhatsApp with the rider's phone number
function openWhatsApp(phone) {
    window.open(`https://wa.me/${phone}`, '_blank');
}

// Call the rider using their phone number
function callRider(phone) {
    window.location.href = `tel:${phone}`;
}

// Edit a ride
function editRide(index) {
    const ride = availableRideData[index];
    document.getElementById("riderName").value = ride.riderName;
    document.getElementById("pickupLocation").value = ride.pickupLocation;
    document.getElementById("destination").value = ride.destination;
    document.getElementById("riderPhone").value = ride.riderPhone;

    editingRideIndex = index;  // Set the ride to be edited
}

// Delete a ride
function deleteRide(index) {
    if (confirm("Are you sure you want to delete this ride?")) {
        availableRideData.splice(index, 1);
        displayAvailableRides();
        riderInfoSection.style.display = "none";  // Hide the rider info section when deleted
        alert("Ride deleted!");
    }
}
