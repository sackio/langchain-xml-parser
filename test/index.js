const chai = require('chai');
const expect = chai.expect;
const {
  XMLParseException,
  XMLValidator,
  XMLOutputParser
} = require('../index.js');

describe('XMLParseException', () => {
  it('should set the text and message correctly', () => {
    const ex = new XMLParseException('some error', 'some text');
    expect(ex.text).to.equal('some text');
    expect(ex.message).to.equal('Failed to parse. Text: "some text". Error: some error');
  });
});

describe('XMLValidator', () => {
  it('should validate XML against XSD', () => {
    const xmlString = '<list><flavor>Chocolate</flavor><flavor>Vanilla</flavor></list>';
    const xsdString = `<?xml version="1.0"?>
    <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
      <xs:element name="list">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="flavor" type="xs:string" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    </xs:schema>`;

    const result = XMLValidator.validateAgainstXSD(xmlString, xsdString);
    expect(result).to.equal(true);
  });

  it('should throw an exception if XML is invalid', () => {
    const xmlString = '<list><flavor>Chocolate</flavor><color>Red</color></list>';
    const xsdString = `<?xml version="1.0"?>
    <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
      <xs:element name="list">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="flavor" type="xs:string" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    </xs:schema>`;

    expect(() => XMLValidator.validateAgainstXSD(xmlString, xsdString)).to.throw(XMLParseException);
  });
});

describe('XMLOutputParser', () => {
  it('should return format instructions', () => {
    const xsdString = `<?xml version="1.0"?>
    <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
      <xs:element name="list">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="flavor" type="xs:string" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    </xs:schema>`;
    const parser = new XMLOutputParser(xsdString);
    const result = parser.getFormatInstructions();
    expect(result).to.include('Your output must be formatted as an XML string');
  });

  it('should parse valid XML', async () => {
    const xmlString = '```xml\n<list><flavor>Chocolate</flavor><flavor>Vanilla</flavor></list>\n```';
    const xsdString = `<?xml version="1.0"?>
    <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
      <xs:element name="list">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="flavor" type="xs:string" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    </xs:schema>`;
    
    const parser = new XMLOutputParser(xsdString);
    const result = await parser.parse(xmlString);
    expect(result).to.equal(xmlString);
  });

  it('should throw an exception for invalid XML', async () => {
    const xmlString = '```xml\n<list><flavor>Chocolate</flavor><color>Red</color></list>\n```';
    const xsdString = `<?xml version="1.0"?>
    <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
      <xs:element name="list">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="flavor" type="xs:string" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    </xs:schema>`;
    
    const parser = new XMLOutputParser(xsdString);
    
    try {
      await parser.parse(xmlString);
      expect.fail('Expected exception was not thrown');
    } catch (e) {
      expect(e).to.be.instanceOf(XMLParseException);
    }
  });
});
