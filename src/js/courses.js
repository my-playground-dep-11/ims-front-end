const btnElm = document.querySelector('#btn-add');
const txtNameElm = document.querySelector("#txt-name");
const txtDurationElm = document.querySelector("#txt-duration");
const tbodyElm = document.querySelector('tbody');
const {API_URL} = process.env;


loadAllCourses();

function loadAllCourses(){
    fetch(`${API_URL}/courses`).then(res =>{
        if(res.ok){
            res.json().then(coursesList => coursesList.forEach(course => createCourse(course)));
        }else{
            alert("Failed to load teachers")
        }

    }).catch(err =>{
        alert("Something went wrong, try again!")
    })
}

function createCourse(course){
    const trElm = document.createElement('tr');
    tbodyElm.append(trElm);
    trElm.innerHTML = `
        <td>${course.courseId}</td>
        <td>${course.courseName}</td>
        <td>${course.durationInMonths}</td>
        <td>
            <i class="edit bi bi-pencil-fill p-1"></i>
            <i class="delete bi bi-trash-fill"></i>
        </td>
    `
}

btnElm.addEventListener('click', () =>{
    const name = txtNameElm.value.trim();
    const duration = txtDurationElm.value.trim();

    if(!/^[A-Za-z ]+$/.test(name)){
        txtNameElm.focus();
        txtNameElm.select();
        return;
    }else if(!/^\d$/.test(duration)){
        txtDurationElm.focus();
        txtDurationElm.select();
        return;
    }

    fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name, duration})
    }).then(res =>{
        if(res.status === 201){
            res.json().then(teacher =>{
                createTeacher(teacher);
                txtNameElm ='';
                txtDurationElm = '';
                txtNameElm.focus();

            });
        }else{
            alert("Failed to create the teacher's record!, try again")
        }
    }).catch(err =>{
        alert("Something went wrong, try again later!")
    })
});

tbodyElm.addEventListener('click', (e) => {
    if (e.target?.classList.contains('delete')) {
        const courseId = e.target.closest('tr').id.
        
    }
});

