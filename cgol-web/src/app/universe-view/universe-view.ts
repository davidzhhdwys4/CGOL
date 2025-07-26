import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { memory } from '../../../../cgol-rust/pkg/cgol_bg.wasm';
import init, { Cell, Universe } from '../../../../cgol-rust/pkg';

@Component({
  selector: 'app-universe-view',
  imports: [MatGridListModule],
  templateUrl: './universe-view.html',
  styleUrl: './universe-view.css'
})
export class UniverseView implements OnInit, AfterViewInit {
  protected readonly height: number = 10;
  protected readonly width: number = 10;
  protected readonly cellSize: number = 10;

  @ViewChild('universecanvas') canvas: ElementRef | undefined;
  private universe: Universe | undefined;

  async ngOnInit() {
    //await init();
    this.universe = Universe.new(this.width, this.height);

    //this.drawGrid();
  }

  async ngAfterViewInit() {
    if (this.universe) {
      this.drawGrid();
      this.drawCells();
      requestAnimationFrame(() => this.renderLoop());
    }
  }

  private renderLoop() {
    if (!this.universe || !this.canvas) return;

    this.universe.tick();
    this.drawGrid();
    this.drawCells();

    requestAnimationFrame(() => this.renderLoop());
  }

  private drawGrid() {
    if (!this.canvas) return;

    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.strokeStyle = 'black';

    for (let i = 0; i <= this.width; i++) {
      ctx.moveTo(i * (this.cellSize + 1) + 1, 0);
      ctx.lineTo(i * (this.cellSize + 1) + 1, this.height * (this.cellSize + 1) + 1);
    }

    for (let j = 0; j <= this.height; j++) {
      ctx.moveTo(0, j * (this.cellSize + 1) + 1);
      ctx.lineTo(this.width * (this.cellSize + 1) + 1, j * (this.cellSize + 1) + 1);
    }

    ctx.stroke();
  }

  private drawCells() {
    if (!this.universe || !this.canvas) return;

    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const cellsPtr = this.universe.get_cells_ptr();
    const cells = new Uint8Array(memory.buffer, cellsPtr, this.width * this.height);
    //let asdf = 1;

    ctx.beginPath();

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const idx = row * this.width + col;
        ctx.fillStyle = cells[idx] === Cell.Dead ? 'white' : 'black';

        ctx.fillRect(
          col * (this.cellSize + 1) + 1,
          row * (this.cellSize + 1) + 1,
          this.cellSize,
          this.cellSize
        );
      }
    }

    ctx.stroke();
  }
}
