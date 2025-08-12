import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="card">
    <div class="card-header"><div class="title">HMIS Dashboard</div></div>
    <div class="grid cols-2">
      <div class="card">
        <div class="title">Summary</div>
        <div class="toolbar">
          <div>Total Patients: {{summary?.totalPatients}}</div>
          <div>Doctors: {{summary?.totalDoctors}}</div>
          <div>Appointments Today: {{summary?.appointmentsToday}}</div>
        </div>
      </div>
      <div class="card">
        <div class="title">Visits by Month ({{year}})</div>
        <canvas #chart width="520" height="220"></canvas>
      </div>
    </div>
  </div>`
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart', { static: false }) chartRef?: ElementRef<HTMLCanvasElement>;
  summary?: { totalPatients:number; totalDoctors:number; appointmentsToday:number };
  year = new Date().getFullYear();
  constructor(private svc: DashboardService) {}
  ngOnInit() {
    this.svc.summary().subscribe(s => this.summary = s);
    this.svc.monthly(this.year).subscribe(data => setTimeout(() => this.draw(data), 0));
  }
  draw(data: { month:number; visits:number }[]) {
    const canvas = this.chartRef?.nativeElement; if (!canvas) return;
    const ctx = canvas.getContext('2d')!; ctx.clearRect(0,0,canvas.width,canvas.height);
    const max = Math.max(...data.map(d=>d.visits), 10); const barW = 30, gap = 12, base=200;
    data.forEach((d,i)=> { const h = (d.visits/max)*180; ctx.fillStyle = '#7c3aed'; ctx.fillRect(20 + i*(barW+gap), base - h, barW, h); });
    ctx.fillStyle = '#94a3b8'; ctx.font = '12px Inter';
    data.forEach((d,i)=> { ctx.fillText(String(d.month), 20 + i*(barW+gap), 215); });
  }
}


