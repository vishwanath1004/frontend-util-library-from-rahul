import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-generic-chart',
  template: `
    <p>
      generic-chart works!
      <lib-bar-chart></lib-bar-chart>
    </p>
  `,
  styles: [
  ]
})
export class GenericChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
