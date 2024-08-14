import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MetaAndTitleService } from '../services/meta-and-title.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(private metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Home');
    this.metaAndTitleService.updateDescription(
      'Dance on Location is a web app that lets you view dance videos positioned nearby to your location.',
    );
  }
}
