import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import 'normalize.css';

import init, { WasmRiscv } from './riscv_emu_rust_wasm.js';
import RiscvEmulator from './RiscvEmulator.js';

const terminal = new Terminal();
const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('terminal'));
terminal.writeln('loading...');

window.onload = window.onresize = () => fitAddon.fit();

Promise.all([
  fetch(require('./fw_payload.elf')),
  fetch(require('./initfs.img')),
  init(require('./riscv_emu_rust_wasm_bg.wasm'))
]).then(async ([elf, fs]) => {
    const elfBuffer = await elf.arrayBuffer();
    const fsBuffer = await fs.arrayBuffer();
    
    terminal.clear();

    const riscv = WasmRiscv.new();
    riscv.setup_program(new Uint8Array(elfBuffer));
    riscv.setup_filesystem(new Uint8Array(fsBuffer));
    riscv.enable_page_cache(true);
    const emu = new RiscvEmulator(riscv, terminal)
    emu.run();
  });
