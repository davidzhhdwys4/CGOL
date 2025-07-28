#![warn(missing_docs)]

//! Rust implementation of Conway's Game Of Life.
//! See https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life

mod utils;

use std::cmp;
use std::io::Cursor;
use image::{GenericImageView, ImageReader};
use wasm_bindgen::prelude::*;

/// Defines the state of a cell in the universe
#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
  /// Represents a dead cell
  Dead = 0,

  /// Represents an alive cell
  Alive = 1
}

/// Defines conway's game of life
#[wasm_bindgen]
pub struct Universe {
  width: u32,
  height: u32,
  cells: Vec<Cell>
}

#[wasm_bindgen]
impl Universe {

  /// Creates a new instance of [Universe]
  /// 
  /// Arguments:
  /// * `width`: the number of cells horizontally in the universe
  /// * `height`: the number of cells vertically in the universe
  pub fn new(width: u32, height: u32) -> Universe {
    utils::set_panic_hook();

    Universe {
      width: width,
      height: height,
      cells: vec![Cell::Dead; (width * height) as usize]
    }
  }

  /// Creates a new instance of [Universe] from an image
  /// 
  /// Arguments:
  /// * `image_data`: the image data to create the universe from
  pub fn from_image(image_data: &[u8]) -> Universe {
    let img = ImageReader::new(Cursor::new(image_data))
      .with_guessed_format()
      .unwrap()
      .decode()
      .unwrap();

    let mut universe = Universe::new(img.width(), img.height());

    for (row, col, pixel) in img.pixels() {
      let index = universe.rowcol_to_ind(row as u32, col as u32);
      if pixel[0] > 128 || pixel[1] > 128 || pixel[2] > 128 {
        universe.cells[index] = Cell::Alive;
      } else {
        universe.cells[index] = Cell::Dead;
      }
    }

    universe
  }

  /// Sets specified cells to be [Cell::Alive] in the universe
  /// 
  /// Arguments:
  /// * `alive_cell_rows`: the row indices of the cells to be set alive
  /// * `alive_cell_cols`: the column indices of the cells to be set alive
  pub fn set_cells_alive(&mut self, alive_cell_rows: &[u32], alive_cell_cols: &[u32]) {
    let len = cmp::min(alive_cell_rows.len(), alive_cell_cols.len());
    for i in 0..len {
      let index = self.rowcol_to_ind(alive_cell_rows[i], alive_cell_cols[i]);
      self.cells[index] = Cell::Alive;
    }
  }

  /// Runs a single iteration of conway's game of life
  pub fn tick(&mut self) {
    let mut next = self.cells.clone();
    let mut ind = 0;

    for row in 0..self.height {
      for col in 0..self.width {
        let live = self.live_neighbor_count(row, col);

        // todo make this rustier
        if self.cells[ind] == Cell::Alive {
          if live < 2 || live > 3 {
            next[ind] = Cell::Dead;
          }
          else {
            next[ind] = Cell::Alive;
          }
        }
        else if live == 3 {
          next[ind] = Cell::Alive;
        }

        ind = ind + 1;
      }
    }

    self.cells = next;
  }

  /// Gets the width of the universe
  pub fn get_width(&self) -> u32 {
    self.width
  }

  /// Gets the height of the universe
  pub fn get_height(&self) -> u32 {
    self.height
  }

  /// Gets a pointer to the cells in the universe
  pub fn get_cells_ptr(&self) -> *const Cell {
    self.cells.as_ptr()
  }
}

impl Universe {
  /// Gets the universe cells as a vector. Useful for unit testing.
  #[cfg(test)]
  fn get_cells(&self) -> &Vec<Cell> {
    &self.cells
  }

  /// Calculates the number of live neighbors around the specified cell
  /// 
  /// Arguments:
  /// * `row`: row index of the specified cell
  /// * `col`: column index of the specified cell
  fn live_neighbor_count(&self, row: u32, col: u32) -> u8 {
    let mut livecount = 0;
    for dr in [self.height - 1, 0, 1] {
      let cur_row = (row + dr) % self.height;

      for dc in [self.width - 1, 0, 1] {
        if dr == 0 && dc == 0 {
          continue;
        }

        let cur_col = (col + dc) % self.width;
        let ind = self.rowcol_to_ind(cur_row, cur_col);
        livecount = livecount + self.cells[ind] as u8;
      }
    }

    livecount
  }

  fn rowcol_to_ind(&self, row: u32, col: u32) -> usize {
    (row * self.width + col) as usize
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  /// Unit test for [`Universe::tick`]
  #[test]
  fn test_tick() {
    let mut actual = Universe::new(6, 6);
    actual.set_cells_alive(&[1, 2, 3, 3, 3], &[2, 3, 1, 2, 3]);

    let mut exp = Universe::new(6, 6);
    exp.set_cells_alive(&[2, 2, 3, 3, 4], &[1, 3, 2, 3, 2]);

    actual.tick();
    assert_eq!(&exp.get_cells(), &actual.get_cells());
  }

  /// Unit test for [`Universe::live_neighbor_count`]
  #[test]
  fn test_live_neighbor_count() {
    let mut u = Universe::new(3, 3);
    u.set_cells_alive(&[0, 0, 1], &[0, 2, 1]);

    assert_eq!(2, u.live_neighbor_count(0, 0));
  }

  /// Unit test for [`Universe::set_cells_alive`]
  #[test]
  fn test_set_cells_alive() {
    let mut u = Universe::new(3, 3);
    u.set_cells_alive(&[0, 0, 1], &[0, 2, 1]);

    let exp = vec![Cell::Alive, Cell::Dead, Cell::Alive, Cell::Dead, Cell::Alive, Cell::Dead, Cell::Dead, Cell::Dead, Cell::Dead];

    assert_eq!(&exp, u.get_cells());
  }
}