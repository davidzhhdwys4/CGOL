import { Component, ElementRef, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AppDB } from '../db/app-db';
import { memory } from '../../../../cgol-rust/pkg/cgol_bg.wasm';
import { Cell, Universe } from '../../../../cgol-rust/pkg';


@Component({
  selector: 'app-universe-view',
  templateUrl: './universe-view.html',
  styleUrl: './universe-view.css',
  imports: [MatInputModule, MatButtonToggleModule, MatIconModule, MatButtonModule],
})
export class UniverseView implements OnInit, AfterViewInit {
  protected readonly height: number = 50;
  protected readonly width: number = 50;
  protected readonly cellSize: number = 15;

  private readonly dbContext = inject(AppDB);

  @ViewChild('universecanvas') private canvas: ElementRef | undefined;
  private universe: Universe | undefined;
  private animationFrameId: number | null = null;
  private isPlaying: boolean = false;
  private liveColor: string = 'black';
  private deadColor: string = 'white';
  private gridColor: string = 'black';

  async ngOnInit() {
    this.universe = Universe.new(this.width, this.height);
  }

  async ngAfterViewInit() {
    if (this.universe && this.canvas) {
      this.liveColor = window.getComputedStyle(this.canvas.nativeElement).color || 'black';
      this.deadColor = window.getComputedStyle(this.canvas.nativeElement).backgroundColor || 'white';
      this.gridColor = window.getComputedStyle(this.canvas.nativeElement).borderColor || 'black';

      this.drawGrid();
      this.drawCells();
    }
  }
  
  protected handleCanvasClick(event: MouseEvent) {
    if (!this.canvas || !this.universe) return;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / (this.cellSize + 1));
    const row = Math.floor(y / (this.cellSize + 1));
    if (col < 0 || col >= this.width || row < 0 || row >= this.height) return;

    // Toggle cell state
    const cellsPtr = this.universe.get_cells_ptr();
    const cells = new Uint8Array(memory.buffer, cellsPtr, this.width * this.height);
    const idx = row * this.width + col;
    cells[idx] = cells[idx] === Cell.Dead ? Cell.Alive : Cell.Dead;

    this.drawCells();
  }

  protected play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.renderLoop();
    }
  }

  protected pause() {
    this.isPlaying = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  protected async save(): Promise<void> {
    if (!this.universe) return;

    const cellsPtr = this.universe.get_cells_ptr();
    const cells = new Uint8ClampedArray(memory.buffer, cellsPtr, this.width * this.height);
    
    const img = new ImageData(this.width, this.height);
    for (let i = 0; i < cells.length; i++) {
      const value = cells[i] === Cell.Alive ? 255 : 0;
      img.data[i * 4] = value;     // Red
      img.data[i * 4 + 1] = value; // Green
      img.data[i * 4 + 2] = value; // Blue
      img.data[i * 4 + 3] = 255;   // Alpha
    }

    const tmpCanvas = new OffscreenCanvas(this.width, this.height);
    const ctx = tmpCanvas.getContext('2d');
    if (ctx) {
      ctx.putImageData(img, 0, 0);

      const blob = await tmpCanvas.convertToBlob();
      const buffer = await blob.arrayBuffer();

      await this.dbContext.games.add({
          name: 'Untitled',
          data: new Uint8Array(buffer)
        });

      // const url = URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'universe.png';
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      // URL.revokeObjectURL(url);
    }
  }

  protected async handleFileInput(event: Event) {
    if (!this.universe) return;

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    const data = await file.arrayBuffer();
    if (!data) return;

    this.universe = Universe.from_image(new Uint8Array(data));
    this.drawCells();

    input.value = '';
  }

  private renderLoop() {
    if (!this.universe || !this.canvas || !this.isPlaying) return;

    this.universe.tick();
    this.drawCells();

    this.animationFrameId = requestAnimationFrame(() => this.renderLoop());
  }

  private drawGrid() {
    if (!this.canvas) return;

    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.strokeStyle = this.gridColor;;

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

    ctx.beginPath();

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const idx = row * this.width + col;
        ctx.fillStyle = cells[idx] === Cell.Dead ? this.deadColor : this.liveColor;

        ctx.clearRect(
          col * (this.cellSize + 1) + 1,
          row * (this.cellSize + 1) + 1,
          this.cellSize,
          this.cellSize
        );

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
