import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from 'src/app/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  tasks: Task[];

  constructor(private http: HttpClient) {
    
  }

  getTasks() {
    this.http.get<{tasks: Task[]}>(SERVER_URL + '/tasks').subscribe(res => {
      this.tasks = res.tasks;
    });
  }

  ngOnInit() {
    this.getTasks();
  }

  onAddTask(taskName: string) {
    this.http.post(SERVER_URL + '/tasks', {
      text: taskName
    }).subscribe(res => {
      this.getTasks();
    })
  }
}

interface Task {
  id: string;
  text: string;
}