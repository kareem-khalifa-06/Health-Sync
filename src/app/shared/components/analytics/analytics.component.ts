import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
interface Statistics {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  totalPatients: number;
  activeDoctors: number;
  totalDepartments: number;
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
  };
  appointmentsByDay: [
    {
      day: string;
      count: number;
    },
  ];
  appointmentsByStatus: [
    {
      status: string;
      count: number;
    },
  ];
  topDoctors: [
    {
      doctorId: string;
      name: string;
      totalAppointments: number;
      rating: number;
    },
  ];
}
@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
})
export class AnalyticsComponent implements AfterViewInit {
  @ViewChild('topDoctorsChart') topDoctorsChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('appointmentsChart')
  appointmentsChart!: ElementRef<HTMLCanvasElement>;

  data: Statistics | null = null;
  timeFilter: string = 'month';
  constructor(private _HttpClient: HttpClient) {}
  ngAfterViewInit() {
    this._HttpClient
      .get<Statistics>('https://health-sync-production-d340.up.railway.app/statistics')
      .subscribe((res) => {
        this.data = res;
        console.log(this.data);

        this.buildCharts();
      });
  }
  get currentRevenue() {
    if (!this.data) return 0;
    switch (this.timeFilter) {
      case 'today':
        return this.data?.revenue.today;
      case 'year':
        return this.data?.revenue.thisYear;
      case 'week':
        return this.data?.revenue.thisWeek;
      default:
        return this.data?.revenue.thisMonth;
    }
  }
  get totalPatients() {
    return this.data?.totalPatients;
  }
  get activeDoctors() {
    return this.data?.activeDoctors;
  }
  get totalDepartments() {
    return this.data?.totalDepartments;
  }
  buildCharts() {
    const primaryGradientColors = [
      '#4F8EF7',
      '#6C63FF',
      '#43C6AC',
      '#F7971E',
      '#F64F59',
      '#11998e',
      '#38ef7d',
      '#FC5C7D',
      '#6A82FB',
      '#FDDB92',
    ];

    // ── Appointments By Day Chart ──────────────────────────────────────
    const appointmentsCtx = this.appointmentsChart.nativeElement;
    const appointmentsGradient = appointmentsCtx
      .getContext('2d')!
      .createLinearGradient(0, 0, 0, 400);
    appointmentsGradient.addColorStop(0, 'rgba(79, 142, 247, 0.85)');
    appointmentsGradient.addColorStop(1, 'rgba(79, 142, 247, 0.15)');

    new Chart(appointmentsCtx, {
      type: 'bar',
      data: {
        labels: this.data?.appointmentsByDay.map((d) => d.day),
        datasets: [
          {
            label: 'Appointments',
            data: this.data?.appointmentsByDay.map((d) => d.count),
            backgroundColor: appointmentsGradient,
            borderColor: 'rgba(79, 142, 247, 1)',
            borderWidth: 2,
            borderRadius: 8, // rounded bar tops
            borderSkipped: false,
            hoverBackgroundColor: 'rgba(108, 99, 255, 0.9)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#CBD5E1',
              font: {
                family: "'DM Sans', sans-serif",
                size: 13,
                weight: 500,
              },
              boxWidth: 14,
              boxHeight: 14,
              borderRadius: 4,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#94A3B8',
            bodyColor: '#F1F5F9',
            borderColor: 'rgba(79, 142, 247, 0.4)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            titleFont: { family: "'DM Sans', sans-serif", size: 11 },
            bodyFont: {
              family: "'DM Sans', sans-serif",
              size: 14,
              weight: 600,
            },
            callbacks: {
              label: (ctx) => `  ${ctx.parsed.y} appointments`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: '#94A3B8',
              font: { family: "'DM Sans', sans-serif", size: 12 },
            },
          },
          y: {
            grid: {
              color: 'rgba(148, 163, 184, 0.08)',
              lineWidth: 1,
            },
            border: { display: false, dash: [4, 4] },
            ticks: {
              color: '#94A3B8',
              font: { family: "'DM Sans', sans-serif", size: 12 },
              stepSize: 1,
              padding: 8,
            },
            beginAtZero: true,
          },
        },
        animation: {
          duration: 900,
          easing: 'easeOutQuart',
        },
      },
    });

    // ── Top Doctors Chart ──────────────────────────────────────────────
    new Chart(this.topDoctorsChart.nativeElement, {
      type: 'bar',
      data: {
        labels: this.data?.topDoctors.map((doc) => doc.name),
        datasets: [
          {
            label: 'Total Appointments',
            data: this.data?.topDoctors.map((doc) => doc.totalAppointments),
            backgroundColor: primaryGradientColors.slice(
              0,
              this.data?.topDoctors.length,
            ),
            borderColor: primaryGradientColors
              .slice(0, this.data?.topDoctors.length)
              .map((c) => c + 'CC'),
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
            hoverBorderWidth: 3,
          },
        ],
      },
      options: {
        indexAxis: 'y', // horizontal bars — much better for doctor names
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#94A3B8',
            bodyColor: '#F1F5F9',
            borderColor: 'rgba(108, 99, 255, 0.4)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            titleFont: { family: "'DM Sans', sans-serif", size: 11 },
            bodyFont: {
              family: "'DM Sans', sans-serif",
              size: 14,
              weight: 600,
            },
            callbacks: {
              label: (ctx) => `  ${ctx.parsed.x} appointments`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(148, 163, 184, 0.08)',
              lineWidth: 1,
            },
            border: { display: false },
            ticks: {
              color: '#94A3B8',
              font: { family: "'DM Sans', sans-serif", size: 12 },
              stepSize: 1,
            },
            beginAtZero: true,
          },
          y: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: '#020b17',
              font: {
                family: "'DM Sans', sans-serif",
                size: 13,
                weight: 500,
              },
            },
          },
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart',
        },
      },
    });
  }
  exportAsPDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const primaryColor: [number, number, number] = [79, 142, 247];
    const darkColor: [number, number, number] = [15, 23, 42];
    const mutedColor: [number, number, number] = [148, 163, 184];

    // ── Header Banner ────────────────────────────────────────────────
    doc.setFillColor(...darkColor);
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setFillColor(...primaryColor);
    doc.rect(0, 26, pageWidth, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Analytics Report', 14, 17);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...mutedColor);
    doc.text(
      `Generated on ${new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`,
      pageWidth - 14,
      17,
      { align: 'right' },
    );

    // ── KPI Summary Cards ────────────────────────────────────────────
    const cards = [
      { label: 'Total Appointments', value: this.data?.totalAppointments ?? 0 },
      { label: 'Total Patients', value: this.data?.totalPatients ?? 0 },
      { label: 'Active Doctors', value: this.data?.activeDoctors ?? 0 },
      { label: 'Departments', value: this.data?.totalDepartments ?? 0 },
    ];

    const cardW = (pageWidth - 28 - 9) / 4; // 4 cards, 3 gaps of 3
    cards.forEach((card, i) => {
      const x = 14 + i * (cardW + 3);
      const y = 34;

      doc.setFillColor(240, 245, 255);
      doc.roundedRect(x, y, cardW, 20, 2, 2, 'F');

      doc.setFillColor(...primaryColor);
      doc.rect(x, y, 3, 20, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...darkColor);
      doc.text(String(card.value), x + 7, y + 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...mutedColor);
      doc.text(card.label.toUpperCase(), x + 7, y + 17);
    });

    // ── Revenue Section ──────────────────────────────────────────────
    let y = 62;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkColor);
    doc.text('Revenue Overview', 14, y);

    doc.setFillColor(...primaryColor);
    doc.rect(14, y + 1.5, 28, 1, 'F');

    y += 7;

    autoTable(doc, {
      startY: y,
      head: [['Period', 'Revenue']],
      body: [
        ['Today', `$${this.data?.revenue.today.toLocaleString() ?? 0}`],
        ['This Week', `$${this.data?.revenue.thisWeek.toLocaleString() ?? 0}`],
        [
          'This Month',
          `$${this.data?.revenue.thisMonth.toLocaleString() ?? 0}`,
        ],
        ['This Year', `$${this.data?.revenue.thisYear.toLocaleString() ?? 0}`],
      ],
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: darkColor },
      alternateRowStyles: { fillColor: [245, 248, 255] },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40, fontStyle: 'bold' },
      },
      margin: { left: 14, right: 14 },
    });

    // ── Appointment Status Breakdown ─────────────────────────────────
    y = (doc as any).lastAutoTable.finalY + 10;

    const statusCards = [
      {
        label: 'Completed',
        value: this.data?.completedAppointments ?? 0,
        color: [34, 197, 94] as [number, number, number],
      },
      {
        label: 'Pending',
        value: this.data?.pendingAppointments ?? 0,
        color: [251, 191, 36] as [number, number, number],
      },
      {
        label: 'Cancelled',
        value: this.data?.cancelledAppointments ?? 0,
        color: [239, 68, 68] as [number, number, number],
      },
    ];

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkColor);
    doc.text('Appointment Status', 14, y);

    doc.setFillColor(...primaryColor);
    doc.rect(14, y + 1.5, 36, 1, 'F');

    y += 7;

    const sCardW = (pageWidth - 28 - 6) / 3;
    statusCards.forEach((card, i) => {
      const x = 14 + i * (sCardW + 3);

      doc.setFillColor(250, 250, 255);
      doc.roundedRect(x, y, sCardW, 18, 2, 2, 'F');

      doc.setFillColor(...card.color);
      doc.roundedRect(x, y, sCardW, 18, 2, 2, 'F');
      doc.setFillColor(250, 250, 255);
      doc.rect(x + 3, y, sCardW - 3, 18, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...darkColor);
      doc.text(String(card.value), x + 8, y + 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...mutedColor);
      doc.text(card.label.toUpperCase(), x + 8, y + 16);
    });

    // ── Appointments By Day ──────────────────────────────────────────
    y += 26;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkColor);
    doc.text('Appointments by Day', 14, y);

    doc.setFillColor(...primaryColor);
    doc.rect(14, y + 1.5, 38, 1, 'F');

    y += 7;

    autoTable(doc, {
      startY: y,
      head: [['Day', 'Appointments']],
      body: this.data?.appointmentsByDay.map((d) => [d.day, d.count]) ?? [],
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: darkColor },
      alternateRowStyles: { fillColor: [245, 248, 255] },
      margin: { left: 14, right: 14 },
    });

    // ── Top Doctors ──────────────────────────────────────────────────
    y = (doc as any).lastAutoTable.finalY + 10;

    // Auto page-break if needed
    if (y + 50 > pageHeight) {
      doc.addPage();

      doc.setFillColor(...darkColor);
      doc.rect(0, 0, pageWidth, 12, 'F');
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(...mutedColor);
      doc.text('Analytics Report (continued)', 14, 8);

      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkColor);
    doc.text('Top Doctors', 14, y);

    doc.setFillColor(...primaryColor);
    doc.rect(14, y + 1.5, 22, 1, 'F');

    y += 7;

    autoTable(doc, {
      startY: y,
      head: [['#', 'Doctor Name', 'Appointments', 'Rating']],
      body:
        this.data?.topDoctors.map((doc, i) => [
          i + 1,
          doc.name,
          doc.totalAppointments,
          `⭐ ${doc.rating.toFixed(1)}`,
        ]) ?? [],
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: darkColor },
      alternateRowStyles: { fillColor: [245, 248, 255] },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
      },
      margin: { left: 14, right: 14 },
    });

    // ── Footer on every page ─────────────────────────────────────────
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFillColor(...darkColor);
      doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...mutedColor);
      doc.text('Confidential — Internal Use Only', 14, pageHeight - 3.5);
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - 14, pageHeight - 3.5, {
        align: 'right',
      });
    }

    doc.save(`analytics-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    console.log('kareem');
  }
}
