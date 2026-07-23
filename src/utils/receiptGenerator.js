// src/utils/receiptGenerator.js

export function createReceiptBytes (order) {
    const encoder = new TextEncoder();
    const commands = [];

    // ESC/POS Native Hex Command Constants
    const ESC = 0x1B;
    const GS = 0x1D;

    const INIT = [ESC, 0x40];                     // Clear buffer & reset settings
    const CENTER = [ESC, 0x61, 1];                 // Text Alignment Center
    const LEFT = [ESC, 0x61, 0];                   // Text Alignment Left
    const RIGHT = [ESC, 0x61, 2];                  // Text Alignment Right
    const BOLD_ON = [ESC, 0x45, 1];                // Font bold weighting true
    const BOLD_OFF = [ESC, 0x45, 0];               // Font bold weighting false
    const DOUBLE_SIZE = [GS, 0x21, 0x11];          // Double height and double width
    const NORMAL_SIZE = [GS, 0x21, 0x00];          // Standard scale layout
    const CUT_PAPER = [GS, 0x56, 0x41, 3];         // Feed paper and execute structural cut
    const OPEN_DRAWER = [ESC, 0x70, 0, 25, 250];   // RJ11 Pin pulse ignition (Kicks Cash Drawer)

    // Helper function to turn strings into raw bytes
    const writeLine = (text = "") => {
        const bytes = encoder.encode(text + "\n");
        commands.push(...Array.from(bytes));
    };

    // 1. Initialize printer and open drawer
    commands.push(...INIT);
    commands.push(...OPEN_DRAWER);

    // 2. Header Elements (Large and Bold)
    commands.push(...CENTER, ...DOUBLE_SIZE, ...BOLD_ON);
    writeLine("MY POS SYSTEM");

    commands.push(...NORMAL_SIZE); // Back to standard font scale
    writeLine("Cloudflare Edge POS LLC");
    writeLine("123 Main Street, Shop 4B");
    writeLine("Tel: 555-0199");
    writeLine("--------------------------------"); // Standard 32 character line rule for 58mm

    // 3. Metadata Content
    commands.push(...LEFT, ...BOLD_OFF);
    writeLine(`Invoice: #${order.id}`);
    writeLine(`Date: ${new Date().toLocaleDateString()}`);
    writeLine(`Time: ${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`);
    writeLine("--------------------------------");

    // 4. Line Items Grid Calculation
    order.items.forEach((item) => {
        // 1. Fallback for safe naming strings
        const itemName = item.name || "Unknown Item";

        // 2. Fallback to 0 if the price is missing or undefined
        const itemPrice = typeof item.price === 'number' ? item.price : Number(item.price || 0);

        // Left side: item name trimmed or padded to exactly 20 characters
        const namePart = itemName.padEnd(20, ' ').substring(0, 20);

        // Right side: currency amount padded to exactly 12 characters
        const pricePart = `$${itemPrice.toFixed(2)}`.padStart(12, ' ');

        writeLine(`${namePart}${pricePart}`);
    });

    // 5. Total Calculations Summary
    writeLine("--------------------------------");
    commands.push(...CENTER, ...BOLD_ON);
    writeLine(`TOTAL AMOUNT: $${order.total.toFixed(2)}`);

    // 6. Footer Content
    commands.push(...BOLD_OFF);
    writeLine("\nThank you for your business!");
    writeLine("Items are non-refundable after 30 days.\n");

    // 7. Push feeds and pop cutter knife strike
    commands.push(...CUT_PAPER);

    // Return a safe Web-Native TypedArray back to the component
    return new Uint8Array(commands);
}
