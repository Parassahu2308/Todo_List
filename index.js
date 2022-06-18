var uid = new ShortUniqueId();      // for generate unique id
const addBtn = document.querySelector(".add-btn");   // for show modal
const modalCont = document.querySelector(".modal-cont");  //for modal container
const allPriorityColors = document.querySelectorAll(".priority-color");   // for choose the color in modal codal contanier
let colors = ["lightpink", "lightgreen", "lightblue", "black"];   //for ticket color
let modalPriorityColor = colors[colors.length - 1];   // default ticket color black
let textAreaCont = document.querySelector(".textarea-cont");   // for write task
const mainCont = document.querySelector(".main-cont");  // for display ticket
let ticketsArr = [];   // for create ticket array
let toolBoxColors = document.querySelectorAll(".color");   // for filters accorf=ding to colors
const removeBtn = document.querySelector(".remove-btn");

//to open close modal container
let isModalPresent = false;
addBtn.addEventListener("click", function () {
  if (!isModalPresent) {
    modalCont.style.display = "flex"; //modal add ho gya screen pe
    // isModalPresent = true;
  } else {
    modalCont.style.display = "none";
    // isModalPresent = false;
  }
  isModalPresent = !isModalPresent; //toggling effect
});

// console.log(allPriorityColors);

//to remove and add active class from each priority color of modal container
allPriorityColors.forEach(function (colorElement) {
  colorElement.addEventListener("click", function () {
    allPriorityColors.forEach(function (priorityColorElem) {
      priorityColorElem.classList.remove("active");
    });
    colorElement.classList.add("active");
    modalPriorityColor = colorElement.classList[0];
  });
});

//to generate and display a ticket 
modalCont.addEventListener("keydown", function (e) {
  let key = e.key;
  if (key == "Shift") {
    // console.log(modalPriorityColor);
    // console.log(textAreaCont.value);
    createTicket(modalPriorityColor, textAreaCont.value);
    modalCont.style.display = "none";
    isModalPresent = false;
    textAreaCont.value = "";
    allPriorityColors.forEach(function (colorElem) {
      colorElem.classList.remove("active");
    });
  }
});

//function to create new ticket 
function createTicket(ticketColor, data, ticketId) {
    let id = ticketId || uid();
    let ticketCont = document.createElement("div"); //<div></div>
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
        <div class="ticket-color ${ticketColor} "></div>
        <div class="ticket-id">${id}</div>
        <div class="task-area">${data}</div>
    `;

    mainCont.appendChild(ticketCont);

    // call handleRemove ticket
    handleRemoval(ticketCont, id);

    //if ticket is being created for the first time , then ticketId would be undefined
    if (!ticketId) {
        ticketsArr.push(
            {
                ticketColor,
                data,
                ticketId: id
            }
        );
        localStorage.setItem("tickets", JSON.stringify(ticketsArr));
    }
};

//get all tickets from local Storage
if (localStorage.getItem("tickets")) {
    ticketsArr = JSON.parse(localStorage.getItem("tickets"));
    ticketsArr.forEach(function(ticketObj){
        createTicket(ticketObj.ticketColor, ticketObj.data, ticketObj.ticketId);
    })
}

//filter tickets on the basis of ticketColor
for (let i = 0; i < toolBoxColors.length; i++){
    toolBoxColors[i].addEventListener("click", function () {
        let currToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketsArr.filter(function (ticketObj) {
            return currToolBoxColor == ticketObj.ticketColor;
        });

        //remove all the tickets
        let allTickets = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTickets.length; i++){
            allTickets[i].remove();
        }

        //display filteredTickets
        filteredTickets.forEach(function (ticketObj) {
            createTicket(
              ticketObj.ticketColor,
              ticketObj.data,
              ticketObj.ticketId
            );
        })
    })

    //to display all the tickets of all colors on double clicking
    toolBoxColors[i].addEventListener("dblclick", function () {
      //remove all the color specific tickets 
        let allTickets = document.querySelectorAll(".ticket-cont");
      for (let i = 0; i < allTickets.length; i++) {
        allTickets[i].remove();
      }

      //display all Tickets
      ticketsArr.forEach(function (ticketObj) {
        createTicket(ticketObj.ticketColor, ticketObj.data, ticketObj.ticketId);
      });
    })
}

//on clicking remove button make color red, and make white if click again on button
let removeBtnActive = false;
removeBtn.addEventListener("click",function(){
  if(removeBtnActive){
    removeBtn.style.color="white";
  }
  else{
    removeBtn.style.color="red";
  }
  removeBtnActive=!removeBtnActive;
});

// remove ticket from local storage and ui
function handleRemoval(ticket, id){
  ticket.addEventListener("click",function(){
    if(!removeBtnActive) return;
       // remove from locsl storage
       //get index from id for delete the ticket
       let idx = getTicketIdx(id);
       console.log(idx);
       ticketsArr.splice(idx,1);

       //remove from browser storage and set  the array
       localStorage.setItem("tickets", JSON.stringify(ticketsArr));

       //remove from front end
       ticket.remove();
  });
};

function getTicketIdx(id){
  let ticketIdx = ticketsArr.findIndex(function(ticketObj){
    return ticketObj.ticketId == id;
  })
  return ticketIdx;
}