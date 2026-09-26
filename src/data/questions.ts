export type AnswerSource = "pdf" | "ai-generated" | "verified";

export interface Question {
  id: string;
  number: string;
  text: string;
  subject: string;
  topic: string;
  year: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  answerSource: AnswerSource;
  explanation: string;
  stepByStep?: string[];
  keyLesson?: string;
  difficulty: "easy" | "medium" | "hard";
  sourcePage?: number;
}

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    number: "ST-1",
    text: "Which bus is bidirectional, and why does that make sense given what it carries?",
    subject: "CSC 106 — Microprocessor Systems",
    topic: "Internal Architecture & the Three-Bus System",
    year: "Study Guide",
    options: [
      { key: "A", text: "Address Bus — because addresses can be both read and written" },
      { key: "B", text: "Data Bus — it carries the actual value being transferred in both directions (CPU reading from or writing to memory/I/O)" },
      { key: "C", text: "Control Bus — because control signals go both ways" },
      { key: "D", text: "System Bus — as a whole it is bidirectional" },
    ],
    correctAnswer: "B",
    answerSource: "pdf",
    explanation:
      "The Data Bus is bidirectional. It carries the actual value being transferred, and transfers happen in both directions (CPU reading from memory/I/O, and CPU writing to memory/I/O), so the same physical lines must be able to drive data either way.",
    stepByStep: [
      "Identify the three main buses: Address, Data, and Control.",
      "Address Bus is unidirectional (CPU → memory/I/O) because the CPU always generates the address.",
      "Control Bus carries mixed status and command lines (some out, some in).",
      "Data Bus must support both reading data into the CPU and writing data out from the CPU, hence bidirectional.",
    ],
    keyLesson: "Directionality of each bus follows the information flow: addresses always leave the CPU; data must travel both ways.",
    difficulty: "easy",
    sourcePage: 20,
  },
  {
    id: "q2",
    number: "ST-2",
    text: "Why does memory-mapped I/O 'use up' part of your memory address space, while I/O-mapped I/O doesn't?",
    subject: "CSC 106 — Microprocessor Systems",
    topic: "Memory Systems & Memory Decoding/Interfacing",
    year: "Study Guide",
    options: [
      { key: "A", text: "Because memory-mapped I/O requires more address lines" },
      { key: "B", text: "Because memory-mapped I/O assigns each device port an address out of the same address range used for memory locations" },
      { key: "C", text: "Because I/O-mapped I/O uses the full 16-bit address bus exclusively" },
      { key: "D", text: "Because memory-mapped devices are slower and need extra space" },
    ],
    correctAnswer: "B",
    answerSource: "pdf",
    explanation:
      "Memory-mapped I/O assigns each device port an address out of the same address range used for memory locations — so every address given to a device is one fewer address available for actual memory. I/O-mapped I/O uses a completely separate address space (selected via the IO/M control line), so ports and memory addresses never compete for the same numbers.",
    stepByStep: [
      "In memory-mapped I/O the same address space and the same instructions (MOV, LDA, STA) are used for both memory and I/O.",
      "Therefore any address allocated to a port cannot be used for a memory location.",
      "In I/O-mapped (standard) I/O the IO/M signal distinguishes the cycle; the lower 8 address lines select one of 256 ports independently of the 64 KB memory space.",
    ],
    keyLesson: "IO/M line is the key hardware signal that separates the two addressing schemes on the 8085.",
    difficulty: "medium",
    sourcePage: 20,
  },
  {
    id: "q3",
    number: "ST-3",
    text: "In the temperature-control loop example, where exactly does the ADC sit, and where does the DAC sit?",
    subject: "CSC 106 — Microprocessor Systems",
    topic: "Microprocessors in Instrumentation, Measurement & Process Control",
    year: "Study Guide",
    options: [
      { key: "A", text: "ADC between microprocessor and actuator; DAC between sensor and microprocessor" },
      { key: "B", text: "ADC between sensor and microprocessor; DAC between microprocessor and actuator" },
      { key: "C", text: "Both ADC and DAC sit between the sensor and the microprocessor" },
      { key: "D", text: "ADC and DAC are both internal to the microprocessor" },
    ],
    correctAnswer: "B",
    answerSource: "pdf",
    explanation:
      "The ADC sits between the sensor and the microprocessor — it converts the sensor's analog voltage into a digital value the microprocessor can read and compare. The DAC sits between the microprocessor and the actuator — it converts the microprocessor's digital decision back into an analog signal the actuator (e.g. a heater drive circuit) can use.",
    stepByStep: [
      "Physical quantity (temperature) → Sensor → analog voltage.",
      "Analog voltage → ADC → digital value readable by the microprocessor.",
      "Microprocessor compares digital value against setpoint and decides action.",
      "Digital command → DAC → analog signal → Actuator (heater, valve, etc.).",
      "The process output feeds back to the sensor, closing the loop.",
    ],
    keyLesson: "ADC is the 'eyes' of the system; DAC is the 'hands'.",
    difficulty: "easy",
    sourcePage: 20,
  },
  {
    id: "q4",
    number: "ST-4",
    text: "Give one realistic scenario where polling is actually the better choice over interrupts.",
    subject: "CSC 106 — Microprocessor Systems",
    topic: "I/O Interfacing: Polling, Interrupts & DMA",
    year: "Study Guide",
    options: [
      { key: "A", text: "When the device responds so quickly and predictably that interrupt overhead would cost more time than a short polling loop, or in a very simple system with only one I/O device" },
      { key: "B", text: "When many devices need service simultaneously" },
      { key: "C", text: "When the device is extremely slow and data arrives only once per hour" },
      { key: "D", text: "When the system has a large number of real-time tasks" },
    ],
    correctAnswer: "A",
    answerSource: "pdf",
    explanation:
      "When the device responds so quickly and predictably that the overhead of an interrupt (saving context, jumping to an ISR, restoring context) would cost more time than a short polling loop — or in a very simple system with only one I/O device and no other useful work for the CPU to do while waiting, where the simplicity of polling outweighs any efficiency loss.",
    stepByStep: [
      "Interrupts have fixed overhead: push PC/flags, jump to ISR, execute ISR, return.",
      "If the expected wait is shorter than this overhead, polling can be faster.",
      "In single-device, single-task systems the CPU has nothing better to do, so polling is simpler and sufficient.",
    ],
    keyLesson: "Choose the I/O method that matches the timing characteristics of the device and the overall system load.",
    difficulty: "medium",
    sourcePage: 20,
  },
  {
    id: "q5",
    number: "ST-5",
    text: "What's the practical difference between full decoding and partial (foldback) decoding of memory?",
    subject: "CSC 106 — Microprocessor Systems",
    topic: "Memory Systems & Memory Decoding/Interfacing",
    year: "Study Guide",
    options: [
      { key: "A", text: "Full decoding checks every unused high-order address bit so each physical chip has one unique address range; partial decoding checks only some bits, causing address foldback" },
      { key: "B", text: "Full decoding is cheaper because it uses fewer gates" },
      { key: "C", text: "Partial decoding is required for DRAM while full decoding is for SRAM" },
      { key: "D", text: "There is no practical difference; both produce the same address map" },
    ],
    correctAnswer: "A",
    answerSource: "pdf",
    explanation:
      "Full decoding checks every unused high-order address bit, so each physical chip has one and only one unique address range. Partial decoding checks only some of those bits to save decoder hardware, which means a chip will also respond to other, unintended address values that happen to match on the bits that were checked — this is address foldback, and it means parts of the address space appear to 'duplicate' the same physical memory.",
    stepByStep: [
      "A memory chip has fewer address pins than the CPU address bus.",
      "The remaining high-order lines must be decoded to generate a unique Chip-Select.",
      "Full decoding: every high-order line participates → unique CS for each range.",
      "Partial decoding: some lines ignored → multiple CPU addresses map to the same physical chip (foldback).",
    ],
    keyLesson: "Foldback wastes address space and can cause subtle bugs if software assumes unique addresses.",
    difficulty: "medium",
    sourcePage: 20,
  },
  {
    id: "q6",
    number: "ST-6",
    text: "Why is 2's complement used for negative numbers instead of simple sign-magnitude?",
    subject: "CSC 106 — Microprocessor Systems",
    topic: "Number Systems & Codes",
    year: "Study Guide",
    options: [
      { key: "A", text: "Because it is easier for humans to read" },
      { key: "B", text: "2's complement lets subtraction be implemented as ordinary addition (A − B = A + (−B)), and it has only one representation of zero" },
      { key: "C", text: "Because sign-magnitude requires more bits" },
      { key: "D", text: "Because 2's complement always uses the MSB as a parity bit" },
    ],
    correctAnswer: "B",
    answerSource: "pdf",
    explanation:
      "2's complement lets subtraction be implemented as ordinary addition (A − B = A + (−B)), so the ALU only needs adder hardware, not separate adder and subtractor circuits. It also has only one representation of zero, unlike sign-magnitude and 1's complement, which both have a +0 and a −0.",
    stepByStep: [
      "Form the negative of a number by inverting all bits and adding 1.",
      "The same adder circuit can then perform both addition and subtraction.",
      "There is exactly one zero (all bits 0), simplifying comparisons and flags.",
      "Hardware cost and speed both improve compared with sign-magnitude.",
    ],
    keyLesson: "Every modern microprocessor ALU is built around 2's complement arithmetic.",
    difficulty: "easy",
    sourcePage: 20,
  },
  {
    id: "q7",
    number: "P1",
    text: "A microprocessor has a 20-bit address bus. What is the maximum memory it can directly address?",
    subject: "CSC 106 — Microprocessor Systems",
    topic: "Internal Architecture & the Three-Bus System",
    year: "Study Guide",
    options: [
      { key: "A", text: "64 KB" },
      { key: "B", text: "256 KB" },
      { key: "C", text: "1 MB (1,048,576 locations)" },
      { key: "D", text: "16 MB" },
    ],
    correctAnswer: "C",
    answerSource: "pdf",
    explanation:
      "Address space = 2^20 = 1,048,576 locations = 1 MB. This is exactly the 8086's real-mode address space (20 address lines A0–A19).",
    stepByStep: [
      "Each address line can be 0 or 1 → two possibilities.",
      "n address lines → 2^n unique addresses.",
      "20 lines → 2^20 = 1 048 576 = 1 MB.",
    ],
    keyLesson: "Address-bus width directly determines the maximum directly-addressable memory.",
    difficulty: "easy",
    sourcePage: 18,
  },
  {
    id: "q8",
    number: "P2",
    text: "Design the chip-select logic needed to map two 2 KB ROM chips into a 16-bit address space starting at 0000H. Which statement is correct?",
    subject: "CSC 106 — Microprocessor Systems",
    topic: "Memory Systems & Memory Decoding/Interfacing",
    year: "Study Guide",
    options: [
      { key: "A", text: "Each chip needs 11 address lines (A0–A10); A11 selects between the two chips (A11=0 → Chip0 0000H–07FFH, A11=1 → Chip1 0800H–0FFFH)" },
      { key: "B", text: "Both chips share the same Chip-Select and the full 16-bit address" },
      { key: "C", text: "A 3-to-8 decoder on A15–A13 is required" },
      { key: "D", text: "Only A0–A10 are used; higher lines are left floating" },
    ],
    correctAnswer: "A",
    answerSource: "pdf",
    explanation:
      "2 KB = 2^11 locations, so each chip needs 11 address lines (A0–A10). That leaves A11–A15 free. Only A11 is needed to distinguish the two chips: A11=0 selects Chip 0 (0000H–07FFH); A11=1 selects Chip 1 (0800H–0FFFH). A single inverter can generate one CS from the other.",
    stepByStep: [
      "Size of each ROM = 2 KB = 2048 = 2^11 → 11 address pins required.",
      "CPU has 16 address lines → 5 free high-order lines.",
      "Two chips need only one select bit → use A11.",
      "Remaining lines A12–A15 can be tied or used for further decoding if more chips are added later.",
    ],
    keyLesson: "Match the number of low-order address lines to the chip capacity; use the next free line(s) for Chip-Select.",
    difficulty: "hard",
    sourcePage: 18,
  },
  {
    id: "q9",
    number: "P3",
    text: "Convert decimal 187 to binary and hexadecimal. Why cannot −187 be validly represented in an 8-bit signed (2's complement) value?",
    subject: "CSC 106 — Microprocessor Systems",
    topic: "Number Systems & Codes",
    year: "Study Guide",
    options: [
      { key: "A", text: "187 = 10111011 (BBH); −187 is outside the 8-bit 2's complement range of −128 to +127" },
      { key: "B", text: "187 = 10111011; −187 fits because the sign bit can hold any magnitude" },
      { key: "C", text: "187 = 10111011; −187 is represented as 01000101" },
      { key: "D", text: "187 cannot be represented in 8 bits at all" },
    ],
    correctAnswer: "A",
    answerSource: "pdf",
    explanation:
      "187 in binary by repeated division by 2 is 1011 1011, which is BBH in hex. In 8-bit 2's complement the representable range is only −128 to +127, so +187 itself is already out of range for a signed 8-bit value (it only fits as an unsigned 8-bit number). The most negative signed 8-bit value is −128 (1000 0000).",
    stepByStep: [
      "Repeated division of 187 by 2 yields remainders that read bottom-to-top as 10111011.",
      "Group into nibbles: 1011 1011 → B B → BBH.",
      "8-bit signed range = −2^(n−1) … 2^(n−1)−1 = −128 … 127.",
      "187 > 127 → cannot be represented as signed 8-bit; −187 is even further outside.",
    ],
    keyLesson: "Always verify that intermediate and final values fit the chosen data width and signed/unsigned interpretation.",
    difficulty: "medium",
    sourcePage: 18,
  },
  {
    id: "q10",
    number: "P4",
    text: "Trace the register contents after executing: MVI A, 05H ; MVI B, 03H ; ADD B ; MOV C, A ; SUB B. What is the final state of A, B and C?",
    subject: "CSC 106 — Microprocessor Systems",
    topic: "Assembly Language Programming",
    year: "Study Guide",
    options: [
      { key: "A", text: "A = 05H, B = 03H, C = 08H" },
      { key: "B", text: "A = 08H, B = 03H, C = 05H" },
      { key: "C", text: "A = 02H, B = 03H, C = 08H" },
      { key: "D", text: "A = 05H, B = 08H, C = 03H" },
    ],
    correctAnswer: "A",
    answerSource: "pdf",
    explanation:
      "Line 1: A = 05H. Line 2: B = 03H (A still 05H). Line 3: A = A + B = 08H (Carry and Zero clear). Line 4: C = A = 08H. Line 5: A = A − B = 08H − 03H = 05H (no borrow). Final: A = 05H, B = 03H, C = 08H.",
    stepByStep: [
      "MVI A,05H → A holds 05H.",
      "MVI B,03H → B holds 03H.",
      "ADD B → A becomes 08H; flags updated (CY=0, Z=0).",
      "MOV C,A → C copies the current A (08H).",
      "SUB B → A becomes 05H again; B remains 03H.",
    ],
    keyLesson: "Trace every instruction; flags are side-effects that matter for later conditional jumps.",
    difficulty: "medium",
    sourcePage: 18,
  },
  {
    id: "q11",
    number: "P5",
    text: "A device is polled 1000 times per second by the CPU just to check a status bit, but it only actually has new data once every 10 seconds. Should the designer switch to interrupt-driven I/O?",
    subject: "CSC 106 — Microprocessor Systems",
    topic: "I/O Interfacing: Polling, Interrupts & DMA",
    year: "Study Guide",
    options: [
      { key: "A", text: "Yes — the CPU wastes almost all of its polling cycles; interrupts free the CPU for useful work" },
      { key: "B", text: "No — polling is always simpler and more reliable" },
      { key: "C", text: "Only if the device supports DMA" },
      { key: "D", text: "No — the 10-second interval is too long for interrupts" },
    ],
    correctAnswer: "A",
    answerSource: "pdf",
    explanation:
      "Strongly in favour of interrupts: the CPU spends the overwhelming majority of its polling cycles (9999 out of 10000 per 10-second window) checking a status bit that says 'not ready' — pure wasted CPU time. Interrupt-driven I/O lets the CPU do useful work continuously and only reacts the instant the device actually has data, at a small fixed one-time cost per interrupt.",
    stepByStep: [
      "Calculate wasted cycles: 1000 polls/s × 10 s = 10 000 polls; only 1 is useful.",
      "99.99 % of the polling work is wasted.",
      "Interrupt cost is paid only once when data is ready.",
      "Therefore interrupts are clearly superior for this workload.",
    ],
    keyLesson: "Polling is acceptable only when the expected wait is short or the CPU has nothing else to do.",
    difficulty: "easy",
    sourcePage: 19,
  },
  {
    id: "q12",
    number: "P6",
    text: "Explain what electrically happens on the buses when the CPU executes OUT 05H to send the value 3CH to an output port. Which sequence is correct?",
    subject: "CSC 106 — Microprocessor Systems",
    topic: "I/O Interfacing: Polling, Interrupts & DMA",
    year: "Study Guide",
    options: [
      { key: "A", text: "05H on lower address lines, IO/M high, 3CH on data bus, WR* pulses low; port latch captures the data" },
      { key: "B", text: "05H on data bus, IO/M low, 3CH on address bus, RD* pulses" },
      { key: "C", text: "Full 16-bit address 0005H, MEMW* active, data 3CH" },
      { key: "D", text: "Port number is placed only on the data bus while address bus is idle" },
    ],
    correctAnswer: "A",
    answerSource: "pdf",
    explanation:
      "1) The CPU places 05H on the lower 8 address lines (and mirrors it onto the upper 8 on the 8085) and asserts IO/M high to mark an I/O cycle. 2) The CPU places the data value 3CH on the data bus. 3) The CPU pulses WR* low; the port decoding logic combines IO/M + address match + WR* to produce a write-enable for that port's latch. 4) The port latch captures 3CH on the WR* pulse; WR* returns high.",
    stepByStep: [
      "OUT instruction → I/O write machine cycle.",
      "IO/M = 1 distinguishes I/O from memory.",
      "Port address appears on A0–A7 (and A8–A15 on 8085).",
      "Data appears on the data bus; WR* strobes it into the selected port.",
    ],
    keyLesson: "IO/M + RD*/WR* + address decoding together generate the unique port enable signal.",
    difficulty: "hard",
    sourcePage: 19,
  },
  {
    id: "q13",
    number: "ARCH-1",
    text: "What is the key difference between Von Neumann and Harvard architectures?",
    subject: "CSC 106 — Microprocessor Systems",
    topic: "Foundations — What Is a Microprocessor",
    year: "Study Guide",
    options: [
      { key: "A", text: "Von Neumann uses one shared memory for instructions and data; Harvard uses separate memories (and often separate buses)" },
      { key: "B", text: "Harvard is older and slower" },
      { key: "C", text: "Von Neumann is used only in microcontrollers" },
      { key: "D", text: "There is no practical difference in modern processors" },
    ],
    correctAnswer: "A",
    answerSource: "pdf",
    explanation:
      "Von Neumann: one shared memory for both instructions and data → single bus → instruction fetch and data access compete (Von Neumann bottleneck). Harvard: separate memory (and often separate buses) for instructions and data → can fetch both simultaneously → faster for a given clock but more complex and less flexible. 8085/8086 are Von Neumann; most microcontrollers (8051, AVR, PIC) are Harvard.",
    difficulty: "easy",
    sourcePage: 3,
  },
  {
    id: "q14",
    number: "ARCH-2",
    text: "Which of the following correctly describes the 8085 flag register bits that are used?",
    subject: "CSC 106 — Microprocessor Systems",
    topic: "Internal Architecture & the Three-Bus System",
    year: "Study Guide",
    options: [
      { key: "A", text: "S (Sign), Z (Zero), AC (Auxiliary Carry), P (Parity), CY (Carry)" },
      { key: "B", text: "Only Zero and Carry" },
      { key: "C", text: "Overflow, Sign, Zero, Parity, Interrupt Enable" },
      { key: "D", text: "All 8 bits are used for status flags" },
    ],
    correctAnswer: "A",
    answerSource: "pdf",
    explanation:
      "The 8085 flag register layout is: Bit7=S (Sign), Bit6=Z (Zero), Bit4=AC (Auxiliary Carry), Bit2=P (Parity), Bit0=CY (Carry). The other bits are unused. S is set when the MSB of the result is 1; Z when the result is zero; AC for BCD correction; P for even parity; CY for carry/borrow out of bit 7.",
    difficulty: "medium",
    sourcePage: 5,
  },
  {
    id: "q15",
    number: "MEM-1",
    text: "Four 4 KB RAM chips are to be mapped starting at 0000H using a 74138 decoder on A15–A12. Which address range belongs to Chip 2?",
    subject: "CSC 106 — Microprocessor Systems",
    topic: "Memory Systems & Memory Decoding/Interfacing",
    year: "Study Guide",
    options: [
      { key: "A", text: "0000H – 0FFFH" },
      { key: "B", text: "1000H – 1FFFH" },
      { key: "C", text: "2000H – 2FFFH" },
      { key: "D", text: "3000H – 3FFFH" },
    ],
    correctAnswer: "C",
    answerSource: "pdf",
    explanation:
      "Each 4 KB chip needs A0–A11. A15–A12 feed a 3-to-8 (or 2-to-4) decoder. The mapping is: 00xx → Chip0 (0000–0FFF), 01xx → Chip1 (1000–1FFF), 10xx → Chip2 (2000–2FFF), 11xx → Chip3 (3000–3FFF).",
    difficulty: "medium",
    sourcePage: 11,
  },
];

export const SUBJECTS = Array.from(new Set(QUESTIONS.map((q) => q.subject)));
export const TOPICS = Array.from(new Set(QUESTIONS.map((q) => q.topic)));
