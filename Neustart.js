

let state = {
    current_view:  "home"
}

function render(view){

    document.querySelectorAll("section").forEach(section=>
        section.classList.remove("active")
       
    ); 
    document.getElementById(`${view}`).classList.add("active")
       
        state.current_view = view;
    document.querySelectorAll(".nav-link").forEach(nav=>
        nav.classList.remove("highlight")
    )

    document.querySelector(`.nav-link[data-view="${view}"]`).classList.add("highlight")
}

document.addEventListener("DOMContentLoaded", ()=>{

    render(state.current_view)
  
   loadData();
    loadData_todo();
   loadData_barChart();
   loadData_donutChart();
  
    checkWeekReset();
});

const navbar = document.querySelector(".nav")
const hamburger = document.querySelector(".hamburger").addEventListener('click', (e)=>{
    navbar.classList.toggle("active");
    e.stopPropagation();
});

window.addEventListener("click", (e) =>{
    if(!navbar.contains(e.target)){
        navbar.classList.remove("active")
    }
})


navbar.addEventListener("click", (e)=>{
    const clicked_btn = e.target.closest(".nav-link")
   
    if(!clicked_btn) return
    const view = clicked_btn.dataset.view;
    render(view)
   

});


let task_array = [];
const done_card = document.querySelector("#done_card");
const todo_card = document.querySelector("#todo_card");
const input_box = document.querySelector("#input_box");
const submit = document.querySelector("#submit");
const doing_card = document.querySelector("#doing_card");
const doing_list = document.querySelector("#doing_list");
const todo_list = document.querySelector("#todo_list");
const done_list = document.querySelector("#done_list");
const today = new Date().getDay();


let done_tasks = [];
let not_done_tasks = [];
let taskChart = null;
let cal_done = 0;
let habitChart = null;


todo_card.appendChild(todo_list);
doing_card.appendChild(doing_list);
done_card.appendChild(done_list);
let next_id = localStorage.getItem('task_id')? Number(localStorage.getItem('task_id')) : 0;

const current_date = new Date(); 

function Render_task(){
   todo_list.innerHTML = "";
   doing_list.innerHTML = "";
   done_list.innerHTML = "";


   task_array.forEach(task_object=>{
    const li = document.createElement("li");
    li.innerHTML = `<span>${task_object.task}</span> `
   li.classList.add('list')
    const start_doing_btn = document.createElement("button");
    start_doing_btn.dataset.id = task_object.id;
    start_doing_btn.classList.add("start_doing")
    // console.log( start_doing_btn.dataset.id)
    li.appendChild(start_doing_btn);

    if(task_object.status === "done"){
        start_doing_btn.style.display = 'none'
        done_list.appendChild(li);
        return

    }
   else if(task_object.status === "doing"){
        start_doing_btn.innerHTML = "Completed"
      doing_list.appendChild(li);
      return
      

    }
    else if(task_object.status === "todo"){
     start_doing_btn.innerHTML = "Start";
      todo_list.appendChild(li);

    }

});
   
   
}





submit.disabled = true
input_box.addEventListener("input",()=>{
if(input_box.value.trim() !== ""){
    submit.disabled = false
}else{
    submit.disabled = true;
}

});





submit.addEventListener("click", ()=>{
    submit.disabled = true
       


next_id++;
localStorage.setItem('task_id', next_id)
// localStorage.removeItem("task_id")
 
    let task_object = {
        id: next_id,
        task: input_box.value,
        status: "todo",
        created_at: new Date().toDateString(),
    }
  
    task_array.push(task_object);
      taskChart.update();


    render_chart()
     saveData_todo();

     loadData_todo();




    input_box.value = '';
    Render_task();
     console.log(task_array)
     console.log(task_object.created_at)
  
});




todo_card.addEventListener("click", (event)=>{

    if(event.target.tagName ==="BUTTON"){
       
      const id_of_clicked_btn = Number(event.target.dataset.id);
      let current_task = task_array.find((task)=> task.id === id_of_clicked_btn );
      if(current_task){
         current_task.status = 'doing'
        saveData_todo();
         loadData_todo();
           console.log(task_array)
         
           
  

     

      }
       
 }
Render_task();
})




doing_card.addEventListener("click", (event)=>{

    if(event.target.tagName ==="BUTTON"){
      const clicked_btn = Number(event.target.dataset.id);
      let current_task = task_array.find((task)=> task.id === clicked_btn );
      if(current_task){
         current_task.status = 'done';
         render_chart()
          saveData_todo()
           loadData_todo();
             console.log(task_array)
     
       

      }
      
     
 
 }
Render_task();
});



function saveData_todo(){
  

    localStorage.setItem("taskArray", JSON.stringify(task_array));
   
 }

function loadData_todo(){
    const saved_task = localStorage.getItem("taskArray");
    const today_date = new Date().toDateString();
    if(saved_task){
        task_array = JSON.parse(saved_task)
        task_array = task_array.filter(t=> t.created_at === today_date);
        Render_task();
    }
     
     
 }
 


// console.log(localStorage)



///Habit page
const habit_holder_container = document.querySelector("#habits_holder");
const input_box2 = document.querySelector("#habit_name")
const habit_days_input = document.querySelector("#num_of_days")
const habit_submit = document.querySelector("#habit_submit")
const habit_form = document.querySelector("#form")
const habit_section = document.querySelector("#habit")
 const modal = document.querySelector(".modal");
  const name_of_habit = document.querySelector("#name_of_habit")
 const category = document.querySelector("#category")
 const target_days = document.querySelector("#target_days")
 const category_of_habit = document.querySelector("#category_of_habit")
 const past_data_container = document.querySelector("#past_data")
 habit_holder_container.appendChild(modal)
 const date = document.querySelector("#date")

habit_form.addEventListener("submit", (event)=>{
    event.preventDefault();
});
const current_week_id = getWeekId();

function checkWeekReset(){
    const lastReset = localStorage.getItem('lastreset')
    const todayDate = new Date().toISOString().split('T')[0]

    if(today === 0 && lastReset !== todayDate){
     habitChart.data.dataset[0].data = [0,0,0,0,0,0,0]
     habitChart.update();
        localStorage.setItem('lastReset', todayDate)
    }
    

}

function getMonday(date = new Date()){
    const d = new Date(date)
    
    const day = d.getDay();

    const diff = d.getDate() - day + (day === 0? -6: 1);
    return new Date(d.setDate(diff))
}

function getWeekId(date = new Date()){
    const monday = getMonday(date)
    const weekID = monday.toISOString().split('T')[0]
     
    return weekID;

}

let habit_array = [];
let habit_ID = 0;


function habit_reset(){
    habit_holder_container.innerHTML = "";
    habit_array.forEach(habit=>{

          const display_habit = document.createElement("div");
          display_habit.classList.add("my-class")
          display_habit.innerHTML =`<h3>${habit.habit_name}</h3>`;
          habit_holder_container.appendChild(display_habit);
          display_habit.dataset.id = habit.ID;
          const checkBox = document.createElement("input")
          checkBox.type = "checkbox";
          display_habit.appendChild(checkBox);
         checkBox.dataset.id = habit.ID;

         checkBox.checked = habit.completed;

  

    });
  
    

}
habit_holder_container.addEventListener("click", (event)=>{
    

       const clicked_div = event.target.closest(".my-class");
       const id_of_div = Number(clicked_div.dataset.id);

       if(!clicked_div)return

       habit_section.appendChild(modal);
       modal.appendChild(name_of_habit);
       modal.classList.add('active');
       const found_habit = habit_array.find(habit => habit.ID === id_of_div);

       if(!found_habit)return

       name_of_habit.textContent = `Name of Habit: ${found_habit.habit_name}`;
       target_days.textContent = ` Targeted Days: ${found_habit.num_of_days}`;
       category_of_habit.textContent = `Name of Category: ${found_habit.category}`
       date.textContent = `Date: ${found_habit.date_created}`;
       event.stopPropagation();

       if(event.target.tagName === "INPUT"){
        const checked_input = event.target;
        const id_of_checkbox = Number(checked_input.dataset.id);
        const found_check = habit_array.find(habit => habit.ID === id_of_checkbox);
        found_check.completed = !found_check.completed;
        bar_chart()



       }

    
});


window.addEventListener("click", (event)=>{
    if(!modal.contains(event.target)){
        modal.classList.remove("active");
    }

})




const inputs = document.querySelectorAll(".input")
function checkForm(){
    let allfilled = true;

inputs.forEach(input =>{
    if(input.value.trim() === ""){
        allfilled = false;
    }
});

habit_submit.disabled = !allfilled;


}


inputs.forEach(input =>{
    input.addEventListener("input", checkForm);
});


habit_submit.addEventListener("click",()=>{
    habit_submit.disabled = true;
    
    
    habit_ID++
    const a_habit = {
        ID:habit_ID,
        habit_name: input_box2.value,
        num_of_days: Number(habit_days_input.value),
        completed: false,
        date_created: new Date().toDateString(),
        category: category.value,
        weekID: getWeekId(),
}
    
    habit_array.push(a_habit)
    saveData();
    console.log(habit_array)
   

    bar_chart()
habit_reset();
habit_form.reset();

});

function loadData(){
    const data = localStorage.getItem("habits");
    habit_array = data ? JSON.parse(data) : [];
     habit_reset();
     
}
 function saveData(){
    localStorage.setItem("habits", JSON.stringify(habit_array));
   
 }



// ANALYTICS

  const centerText = {
    id: 'centerText',
    beforeDraw(chart){
        console.log('beforeDraw running', cal_done)
        const {width, height, ctx } = chart
        ctx.restore()
        ctx.font = 'bold 24px poppins'
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#ffffff'
        ctx.fillText(`${cal_done.toFixed(0)}%`, width / 2, height / 2)
        ctx.save()
    }
  }



function render_chart(){
        done_tasks = task_array.filter(task=> task.status === 'done').length
     not_done_tasks = task_array.filter(task=> task.status !== 'done').length
      cal_done = (done_tasks / task_array.length) * 100;
     const cal_not_done = (not_done_tasks / task_array.length) * 100;
   
    

  
   

 
     
     if(taskChart){
        taskChart.data.datasets[0].data = [cal_done, cal_not_done]
        taskChart.update();
          saveData_donutChart();

     }
     else{
        const myDonutChart = document.getElementById("myDonutChart")
       
    taskChart = new Chart(myDonutChart, {
    type: 'doughnut',
    data:{
        labels:['DONE TASKS', 'NOT DONE TASKS'],
        datasets:[{
            data: [ 0, 100],
           backgroundColor:[ '#22c55e', '#3f3f46']
            

        }]
        
    },

    options:{
        responsive: true,
        maintainAspectRatio: false,
    }
 });
     }


            

    
   


}


render_chart();


function loadData_donutChart(){
    const data = localStorage.getItem("donut");
    taskChart.data.datasets[0].data = data ? JSON.parse(data) : [0,100];
    taskChart.update()
     
     
}
 function saveData_donutChart(){
    localStorage.setItem("donut", JSON.stringify(taskChart.data.datasets[0].data));
   
 }

// localStorage.removeItem('donut');


function bar_chart(){
    const weekID = getWeekId()
    const savedWeekId = localStorage.getItem('currentWeekId')


    if(savedWeekId !== weekID){
        console.log("week changed")
        habit_array = []
        saveData()
        localStorage.setItem('currentWeekId', weekID)
        localStorage.setItem('barData', JSON.stringify([0,0,0,0,0,0,0]));

        if(habitChart){
    habitChart.data.datasets[0].data = [0,0,0,0,0,0,0];
   
    
        habitChart.update();
        return
    }
    }
    const barData = JSON.parse(localStorage.getItem('barData') || [0,0,0,0,0,0,0])



    let done_habit = habit_array.filter(h=> h.completed === true).length
    console.log(done_habit)
    let  habit_done = (done_habit / habit_array.length) * 100;
    console.log(habit_done)



if(habitChart){
    habitChart.data.datasets[0].data[today] = habit_done
     saveData_barChart();
        habitChart.update();
       
}else{

      const myBarChart = document.getElementById("myBarChart")
       
    habitChart = new Chart(myBarChart, {
    type: 'bar',
    data:{
        labels:['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'friday', 'saturday'],
        datasets:[{
            data:barData,
            backgroundColor:[ 'yellow'],
            color: 'white',
            label: "HABIT DAILY TASKS",
           
            

        }]
   
    },
     options:{
        responsive: true,
        maintainAspectRatio: false,
        scales:{
            x:{
                ticks:{
                    color: "yellow",
                    font:{
                        size: 14
                    }
                }
            },
            y:{
                ticks:{
                    color: "yellow",
                    font:{
                        size: 14
                    }
                }
            }
        }
    }
 });

}



       
}
bar_chart();






function loadData_barChart(){
    const data = localStorage.getItem("bar");
    habitChart.data.datasets[0].data = data ? JSON.parse(data) : [];
     
     
}
 function saveData_barChart(){
    localStorage.setItem("bar", JSON.stringify(habitChart.data.datasets[0].data));
   
 }
 


