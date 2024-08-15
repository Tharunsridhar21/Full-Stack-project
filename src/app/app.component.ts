import { Component, OnInit } from '@angular/core';
import { TimeEntryService } from './time-entry.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Employee';
  timeEntries: any[] = [];
  timeEntriesByEmployeeAndMonth: any[] = [];

  // NgxCharts data format
  chartData: any[] = [];

  // Pie Chart Options
  view: [number, number] = [700, 400];
  showLegend: boolean = true;
  showLabels: boolean = true;
  explodeSlices: boolean = false;
  doughnut: boolean = false;

  // Define the color scheme with the correct type
  colorScheme: Color = { 
    domain: [],  // This will be populated dynamically
    group: ScaleType.Ordinal, 
    selectable: true, 
    name: 'Employee Colors'
  };

  constructor(private timeEntryService: TimeEntryService) {}

  ngOnInit(): void {
    this.timeEntryService.getTimeEntries().subscribe(
      (data: any[]) => {
        this.timeEntries = data;
        this.timeEntriesByEmployeeAndMonth = this.calculateTotalTimePerMonth(data);

        // Sort entries in descending order by TotalHours
        this.timeEntriesByEmployeeAndMonth.sort((a, b) => b.TotalHours - a.TotalHours);

        this.updateChartData(this.timeEntriesByEmployeeAndMonth);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  calculateTotalTimePerMonth(entries: any[]): any[] {
    const result = [];

    const groupedEntries = entries.reduce((acc, entry) => {
      const employeeName = entry.EmployeeName;
      const start = new Date(entry.StarTimeUtc);
      const end = new Date(entry.EndTimeUtc);
      const monthKey = `${start.getFullYear()}-${start.getMonth() + 1}`; // YYYY-MM format

      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Convert to hours

      if (!acc[employeeName]) {
        acc[employeeName] = {};
      }

      if (!acc[employeeName][monthKey]) {
        acc[employeeName][monthKey] = { EmployeeName: employeeName, TotalHours: 0 };
      }

      acc[employeeName][monthKey].TotalHours += hours;

      return acc;
    }, {} as any);

    for (const employeeName in groupedEntries) {
      for (const monthKey in groupedEntries[employeeName]) {
        groupedEntries[employeeName][monthKey].TotalHours = Math.round(groupedEntries[employeeName][monthKey].TotalHours); // Round off the total hours
        result.push(groupedEntries[employeeName][monthKey]);
      }
    }

    return result;
  }

  private getUniqueColors(numColors: number): string[] {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#F7464A', '#8E5EA2', '#3E95CD', '#FFCC00'];
    return colors.slice(0, numColors); // Limit colors to the number available
  }

  updateChartData(entries: any[]): void {
    const uniqueEmployeeNames = [...new Set(entries.map(entry => entry.EmployeeName))];
    const colors = this.getUniqueColors(uniqueEmployeeNames.length);

    this.chartData = entries.map((entry, index) => ({
      name: entry.EmployeeName || 'Unknown Employee',
      value: entry.TotalHours,
      color: colors[index % colors.length] // Use modulo to handle more employees than colors
    }));

    // Update colorScheme to use the dynamic colors
    this.colorScheme.domain = colors;
  }

  editEntry(entry: any): void {
    console.log('Edit entry:', entry);
    // Implement your edit logic here
  }
}
