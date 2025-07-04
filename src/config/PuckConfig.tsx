import type { Config, Fields } from '@measured/puck';
import "@measured/puck/puck.css";

const commonBoxFields: Fields = {
  width: { type: 'number', label: 'Width' },
  widthUnit: {
    type: 'select',
    label: 'Width Unit',
    options: [
      { label: 'px', value: 'px' },
      { label: '%', value: '%' }
    ]
  },
  padding: { type: 'number', label: 'Padding (px)' },
  margin: { type: 'number', label: 'Margin (px)' },
  textAlign: {
    type: 'select',
    label: 'Text Align',
    options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' },
      { label: 'Justify', value: 'justify' }
    ]
  }
};

const commonBoxStyle = (props: any) => ({
  width: props.width ? `${props.width}${props.widthUnit || '%'}` : '100%',
  padding: props.padding ? `${props.padding}px` : undefined,
  margin: props.margin ? `${props.margin}px` : undefined,
  textAlign: props.textAlign || undefined
});

const PuckConfig: Config = {
  components: {
    Heading: {
      render: ({ children, color, fontSize, ...rest }) => (
        <h2
          style={{
            ...commonBoxStyle(rest),
            color,
            fontSize: fontSize ? `${fontSize}px` : undefined,
            fontWeight: 'bold'
          }}
        >
          {children}
        </h2>
      ),
      fields: {
        children: { type: 'text', label: 'Text' },
        color: { type: 'text', label: 'Text Color' },
        fontSize: { type: 'number', label: 'Font Size (px)' },
        ...commonBoxFields
      },
      defaultProps: {
        children: 'Heading Text',
        color: '#000000',
        fontSize: 24,
        widthUnit: '%'
      }
    },
    Paragraph: {
      render: ({ children, color, fontSize, ...rest }) => (
        <p
          style={{
            ...commonBoxStyle(rest),
            color,
            fontSize: fontSize ? `${fontSize}px` : undefined
          }}
        >
          {children}
        </p>
      ),
      fields: {
        children: { type: 'textarea', label: 'Text' },
        color: { type: 'text', label: 'Text Color' },
        fontSize: { type: 'number', label: 'Font Size (px)' },
        ...commonBoxFields
      },
      defaultProps: {
        children: 'Paragraph text',
        color: '#000000',
        fontSize: 16,
        widthUnit: '%'
      }
    },
    Image: {
      render: ({ src, alt, height, objectFit, objectPosition, ...rest }) => (
        <img
          src={src}
          alt={alt}
          style={{
            ...commonBoxStyle(rest),
            height: height ? `${height}px` : 'auto',
            objectFit,
            objectPosition
          }}
        />
      ),
      fields: {
        src: { type: 'text', label: 'Image URL' },
        alt: { type: 'text', label: 'Alt Text' },
        height: { type: 'number', label: 'Height (px)' },
        objectFit: {
          type: 'select',
          label: 'Object Fit',
          options: [
            { label: 'Fill', value: 'fill' },
            { label: 'Contain', value: 'contain' },
            { label: 'Cover', value: 'cover' },
            { label: 'None', value: 'none' },
            { label: 'Scale Down', value: 'scale-down' }
          ]
        },
        objectPosition: { type: 'text', label: 'Object Position' },
        ...commonBoxFields
      },
      defaultProps: {
        src: '',
        alt: 'Image',
        widthUnit: '%'
      }
    },
    Button: {
      render: ({ children, href, backgroundColor, color, ...rest }) => (
        <a
          href={href}
          style={{
            ...commonBoxStyle(rest),
            backgroundColor,
            color,
            padding: '8px 16px',
            borderRadius: '4px',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          {children}
        </a>
      ),
      fields: {
        children: { type: 'text', label: 'Button Text' },
        href: { type: 'text', label: 'URL' },
        backgroundColor: { type: 'text', label: 'Background Color' },
        color: { type: 'text', label: 'Text Color' },
        ...commonBoxFields
      },
      defaultProps: {
        children: 'Click Me',
        href: '#',
        backgroundColor: '#007bff',
        color: '#ffffff',
        widthUnit: '%'
      }
    },
    List: {
      render: ({ items, ordered, ...rest }) => {
        const Tag = ordered ? 'ol' : 'ul';
        return (
          <Tag style={commonBoxStyle(rest)}>
            {items.map((item: any, i: number) => (
              <li key={i}>{item.text}</li>
            ))}
          </Tag>
        );
      },
      fields: {
        ordered: {
          type: 'radio',
          label: 'List Type',
          options: [
            { label: 'Unordered', value: false },
            { label: 'Ordered', value: true }
          ]
        },
        items: {
          type: 'array',
          label: 'Items',
          arrayFields: {
            text: { type: 'text', label: 'Item Text' }
          }
        },
        ...commonBoxFields
      },
      defaultProps: {
        ordered: false,
        items: [{ text: 'Item 1' }, { text: 'Item 2' }],
        widthUnit: '%'
      }
    },
    Card: {
      render: ({ backgroundColor, content: Content, ...rest }) => (
        <div style={{ ...commonBoxStyle(rest), backgroundColor, border: '1px solid #ddd', borderRadius: '8px' }}>
          <Content />
        </div>
      ),
      fields: {
        backgroundColor: { type: 'text', label: 'Background Color' },
        content: { type: 'slot', label: 'Content' },
        ...commonBoxFields
      },
      defaultProps: {
        backgroundColor: '#f9f9f9',
        widthUnit: '%'
      }
    },
    Flex: {
      render: ({ direction, align, justify, gap, content: Content, ...rest }) => (
        <div style={{ ...commonBoxStyle(rest), }}>
          <Content style={{ display: 'flex', flexDirection: direction, alignItems: align, justifyContent: justify, gap: gap ? `${gap}px` : undefined }} />
        </div>
      ),
      fields: {
        direction: {
          type: 'radio',
          label: 'Direction',
          options: [
            { label: 'Row', value: 'row' },
            { label: 'Column', value: 'column' }
          ]
        },
        align: {
          type: 'select',
          label: 'Align Items',
          options: [
            { label: 'Stretch', value: 'stretch' },
            { label: 'Start', value: 'flex-start' },
            { label: 'Center', value: 'center' },
            { label: 'End', value: 'flex-end' }
          ]
        },
        justify: {
          type: 'select',
          label: 'Justify Content',
          options: [
            { label: 'Start', value: 'flex-start' },
            { label: 'Center', value: 'center' },
            { label: 'End', value: 'flex-end' },
            { label: 'Space Between', value: 'space-between' },
            { label: 'Space Around', value: 'space-around' }
          ]
        },
        gap: { type: 'number', label: 'Gap (px)' },
        content: { type: 'slot', label: 'Flex Content' },
        ...commonBoxFields
      },
      defaultProps: {
        direction: 'row',
        align: 'stretch',
        justify: 'flex-start',
        gap: 0,
        widthUnit: '%'
      }
    },
    Grid: {
      render: ({ columns, gap, content: Content, ...rest }) => (
        <div style={{ ...commonBoxStyle(rest), }}>
          <Content style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: gap ? `${gap}px` : undefined }} />
        </div>
      ),
      fields: {
        columns: { type: 'number', label: 'Columns' },
        gap: { type: 'number', label: 'Gap (px)' },
        content: { type: 'slot', label: 'Grid Content' },
        ...commonBoxFields
      },
      defaultProps: {
        columns: 2,
        gap: 16,
        widthUnit: '%'
      }
    },
    Header: {
      render: ({ backgroundColor, content: Content, ...rest }) => (
        <header style={{ ...commonBoxStyle(rest), backgroundColor }}>
          <Content />
        </header>
      ),
      fields: {
        backgroundColor: { type: 'text', label: 'Background Color' },
        content: { type: 'slot', label: 'Header Content' },
        ...commonBoxFields
      },
      defaultProps: {
        backgroundColor: '#eee',
        widthUnit: '%'
      }
    },
    Footer: {
      render: ({ backgroundColor, content: Content, ...rest }) => (
        <footer style={{ ...commonBoxStyle(rest), backgroundColor }}>
          <Content />
        </footer>
      ),
      fields: {
        backgroundColor: { type: 'text', label: 'Background Color' },
        content: { type: 'slot', label: 'Footer Content' },
        ...commonBoxFields
      },
      defaultProps: {
        backgroundColor: '#eee',
        widthUnit: '%'
      }
    }
  }
};

export default PuckConfig;
