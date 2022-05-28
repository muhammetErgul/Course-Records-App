class Course {
    constructor(title, instructor, image) {
        this.title = title;
        this.instructor = instructor;
        this.image = image;
        this.courseId = Math.floor(Math.random() * 100000);
    }
}
// UI constructor
class UI {
    addCourseToList(course) {
        const list = document.getElementById('courseList');
        var html = `
        <tr>
        <td><img src="img/${course.image}"/></td>
        <td>${course.title}</td>
        <td>${course.instructor}</td>
        <td> <a href="#" data-id="${course.courseId}" class="btn btn-danger btn-sm delete">Delete</a></td>
        </tr>      
    `;
        list.innerHTML += html;
    }
    clearControls() {
        const title = document.getElementById('title').value = "";
        const instructor = document.getElementById('instructor').value = "";
        const image = document.getElementById('image').value = "";
    }
    deleteCourse(element){
        if(element.classList.contains('delete')){
            element.parentElement.parentElement.remove();
            return true;
        }

    }
    showAlert(message,className){
        const alert = `
        <div class="alert alert-${className}">
                ${message}
        </div>
        `;
        const alertRow = document.querySelector('.row');
        alertRow.insertAdjacentHTML('beforebegin',alert);
        setTimeout(()=>{
            document.querySelector('.alert').remove();
        },3000);
    }
}
// Storage constructor
class Storage {
    static getCourses(){
        let courses;
        if(localStorage.getItem('courses')===null){
            courses = [];
        }else {
            courses = JSON.parse(localStorage.getItem('courses'))
        }
        return courses;
    }
    static addCourse(course){
        const courses = Storage.getCourses();
        courses.push(course);
        localStorage.setItem('courses',JSON.stringify(courses));
    }
    static displayCourse(){
        const courses = Storage.getCourses();
        courses.forEach((course)=>{
            const ui = new UI();
            ui.addCourseToList(course);
        });
    }
    static deleteCourse(element){
       if(element.classList.contains('delete')){
           const id = element.getAttribute('data-id');
           const courses = Storage.getCourses();
           courses.forEach((course,index)=>{
               if(course.courseId == id){
                   courses.splice(index,1);
               }
           });
           localStorage.setItem('courses',JSON.stringify(courses));
       }
    }
}
document.addEventListener('DOMContentLoaded',Storage.displayCourse);

document.getElementById('newCourse').addEventListener('submit', function (e) {

    const title = document.getElementById('title').value;
    const instructor = document.getElementById('instructor').value;
    const image = document.getElementById('image').value;

    // creat course object
    const course = new Course(title, instructor, image);
    // create UI
    const ui = new UI();
    if (title === '' || instructor === '' || image === '') {
        ui.showAlert('Please complete the form', 'warning');
    } else {
        // add course to list   tarayıcı üzerindeki liste üzerinde ekleme.
        ui.addCourseToList(course);
        // save to LS kurs bilgisini Localstorage a ekleme
        Storage.addCourse(course);
        // clear
        ui.clearControls();
        ui.showAlert('The course has been added', 'success');
    }
    e.preventDefault();
});
document.getElementById('courseList').addEventListener('click',(e)=>{
    const ui = new UI();
      if(ui.deleteCourse(e.target)== true){
          Storage.deleteCourse(e.target);
          ui.showAlert('The course is has been deleted','danger');
      }
    e.preventDefault();
});