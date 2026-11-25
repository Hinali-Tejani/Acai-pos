import { useState } from 'react';

export function useThermalPrinter() {
  const [device, setDevice] = useState(null);

  const connectPrinter = async () => {
    try {
      const selectedDevice = await navigator.usb.requestDevice({
        filters: [{ classCode: 0x07 }]
      });

      await selectedDevice.open();
      
      if (selectedDevice.configuration === null) {
        await selectedDevice.selectConfiguration(1);
      }
      
      await selectedDevice.claimInterface(0);
      setDevice(selectedDevice);
      console.log(`Connected: ${selectedDevice.productName || "Thermal Printer"}`);
    } catch (error) {
      console.error("WebUSB Connection Error:", error);
      console.log("Device pairing failed.");
    }
  };

  const printRaw = async (uint8ArrayBytes) => {
    if (!device) {
      console.log("Printer is not active. Please connect first.");
      return;
    }

    try {
      // Fixed standard chaining pattern path
      const interfaceAlternate = device.configuration?.interfaces?.[0]?.alternates?.[0];
      const endpoint = interfaceAlternate?.endpoints?.find(
        (e) => e.direction === 'out' && e.type === 'bulk'
      );

      if (!endpoint) {
        throw new Error("Could not find native outbound endpoint address channel.");
      }

      await device.transferOut(endpoint.endpointNumber, uint8ArrayBytes);
    } catch (error) {
      console.error("USB Write Failure:", error);
      console.log("Printing failed.");
    }
  };

  return { device, connectPrinter, printRaw };
}
