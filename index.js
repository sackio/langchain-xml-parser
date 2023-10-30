const libxmljs = require('libxmljs');

const {
  OutputParserException,
} = require('langchain/schema/output_parser');

class XMLParseException extends OutputParserException {
  constructor(message, text) {
    super(`Failed to parse. Text: "${text}". Error: ${message}`);
    this.text = text;
  }
}

class XMLValidator {
  static validateAgainstXSD(xmlString, xsdString) {
    const xmlDoc = libxmljs.parseXml(xmlString);
    const dtd = libxmljs.parseXml(xsdString);
    
    xmlDoc.validate(dtd);

    if (xmlDoc?.validationErrors?.length) {
      let errorMessage = xmlDoc.validationErrors.map(v => `${v.message} (line: ${v.line}, column: ${v.column})`).join('\n');
      throw new XMLParseException(`XML does not conform to the provided XSD: ${errorMessage}`, xmlString);
    }

    return true;
  }
}

class XMLOutputParser {
  constructor(schema) {
    this.xsd = schema;
  }

  getFormatInstructions() {
    const instructions = `
      Your output must be formatted as an XML string that adheres to a given XSD.
      Here is the XSD your output must adhere to:
      \`\`\`xml
      ${this.xsd}
      \`\`\`

      Make sure your XML output starts with the appropriate XML declaration. Typically, this is <?xml version="1.0" encoding="UTF-8"?>
      Use proper XML namespaces if they are provided in the XDC. This helps in avoiding naming conflicts and ensures your document is correctly interpreted.

      Ensure you do not add any namespaces or other changes that would invalidate your XML against this XSD.
    `;

    return instructions;
  }

  async parse(xmlText) {

    let xml = (xmlText.includes("```") ? xmlText.trim().split(/```(?:xml)?/)[1] : xmlText.trim()).trim();
    
    XMLValidator.validateAgainstXSD(xml, this.xsd);
    
    return xmlText;
  }
}

module.exports = { XMLParseException, XMLValidator, XMLOutputParser };