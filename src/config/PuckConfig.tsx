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
  borderRadius: { type: 'number', label: 'Border Radius (px)' },
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
  borderRadius: props.borderRadius ? `${props.borderRadius}px` : undefined,
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
        src: { 
          type: 'custom', 
          label: 'Image URL or Upload',
          render: ({ onChange, value }) => (
            <div>
              <input
                type="text"
                placeholder="Image URL"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                style={{ width: '100%', marginBottom: '8px' }}
              />
              <input
                type="file"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('image', file);
            
                    const res = await fetch(`https://api.imgbb.com/1/upload?key=1a8e6e50c22ea42de12f3741b2ea605d`, {
                      method: 'POST',
                      body: formData,
                    });
            
                    const data = await res.json();
                    const url = data.data?.url;
                    if (url) {
                      console.log(url);
                      onChange(url); // This updates the src field
                    }
                  }
                }}
              />
            </div>
          )
        },
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
      render: ({ backgroundColor, borderColor, shadow, content: Content, ...rest }) => (
        <div style={{ 
          ...commonBoxStyle(rest), 
          backgroundColor, 
          border: borderColor ? `1px solid ${borderColor}` : '1px solid #ddd',
          boxShadow: shadow ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          if (shadow) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (shadow) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }
        }}
        >
          <Content />
        </div>
      ),
      fields: {
        backgroundColor: { type: 'text', label: 'Background Color' },
        borderColor: { type: 'text', label: 'Border Color' },
        shadow: { 
          type: 'radio', 
          label: 'Add Shadow',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]
        },
        content: { type: 'slot', label: 'Content' },
        ...commonBoxFields
      },
      defaultProps: {
        backgroundColor: '#f9f9f9',
        borderColor: '#ddd',
        shadow: true,
        borderRadius: 8,
        widthUnit: '%'
      }
    },
    LogoCard: {
      render: ({ 
        logo, 
        title, 
        description, 
        backgroundColor, 
        borderColor, 
        shadow, 
        flexDirection, 
        alignItems, 
        justifyContent,
        logoSize,
        ...rest 
      }) => (
        <div style={{ 
          ...commonBoxStyle(rest), 
          backgroundColor, 
          border: borderColor ? `1px solid ${borderColor}` : '1px solid #ddd',
          boxShadow: shadow ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          if (shadow) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (shadow) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }
        }}
        >
          <div style={{ 
            display: 'flex', 
            flexDirection: flexDirection || 'row',
            alignItems: alignItems || 'center',
            justifyContent: justifyContent || 'flex-start',
            gap: '16px'
          }}>
            {logo && (
              <div style={{ flexShrink: 0 }}>
                <img 
                  src={logo} 
                  alt="Logo" 
                  style={{ 
                    width: logoSize ? `${logoSize}px` : '60px',
                    height: logoSize ? `${logoSize}px` : '60px',
                    objectFit: 'contain'
                  }} 
                />
              </div>
            )}
            <div style={{ flex: 1 }}>
              {title && (
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  {title}
                </h3>
              )}
              {description && (
                <p style={{ 
                  margin: '0', 
                  fontSize: '14px', 
                  lineHeight: '1.5',
                  color: '#666'
                }}>
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      ),
      fields: {
        logo: { 
          type: 'custom', 
          label: 'Logo Image URL',
          render: ({ onChange, value }) => (
            <div>
              <input
                type="text"
                placeholder="Logo URL"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                style={{ width: '100%', marginBottom: '8px' }}
              />
              <input
                type="file"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('image', file);
            
                    const res = await fetch(`https://api.imgbb.com/1/upload?key=1a8e6e50c22ea42de12f3741b2ea605d`, {
                      method: 'POST',
                      body: formData,
                    });
            
                    const data = await res.json();
                    const url = data.data?.url;
                    if (url) {
                      onChange(url);
                    }
                  }
                }}
              />
            </div>
          )
        },
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
        backgroundColor: { type: 'text', label: 'Background Color' },
        borderColor: { type: 'text', label: 'Border Color' },
        shadow: { 
          type: 'radio', 
          label: 'Add Shadow',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]
        },
        flexDirection: {
          type: 'radio',
          label: 'Layout Direction',
          options: [
            { label: 'Row', value: 'row' },
            { label: 'Column', value: 'column' }
          ]
        },
        alignItems: {
          type: 'select',
          label: 'Align Items',
          options: [
            { label: 'Stretch', value: 'stretch' },
            { label: 'Start', value: 'flex-start' },
            { label: 'Center', value: 'center' },
            { label: 'End', value: 'flex-end' }
          ]
        },
        justifyContent: {
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
        logoSize: { type: 'number', label: 'Logo Size (px)' },
        ...commonBoxFields
      },
      defaultProps: {
        title: 'Card Title',
        description: 'This is a description for the card. You can customize this text.',
        backgroundColor: '#ffffff',
        borderColor: '#e5e5e5',
        shadow: true,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        logoSize: 60,
        borderRadius: 8,
        widthUnit: '%'
      }
    },
    Flex: {
      render: ({ direction, align, justify, gap, content: Content, ...rest }) => (
        <div style={{ ...commonBoxStyle(rest) }}>
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
        <div>
          <Content style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: gap ? `${gap}px` : undefined, ...commonBoxStyle(rest) }} />
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
      render: ({ logo, logoText, navLinks, backgroundColor, textColor, padding, shadow, sticky, ...rest }) => (
        <header 
          style={{ 
            ...commonBoxStyle(rest), 
            backgroundColor: backgroundColor || '#ffffff',
            color: textColor || '#000000',
            padding: padding ? `${padding}px` : '16px',
            boxShadow: shadow ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            position: sticky ? 'sticky' : 'static',
            top: sticky ? '0' : 'auto',
            zIndex: sticky ? '1000' : 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {logo && (
              <img 
                src={logo} 
                alt="Logo" 
                style={{ 
                  height: '40px', 
                  width: 'auto', 
                  marginRight: '12px' 
                }} 
              />
            )}
            {logoText && (
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                margin: '0',
                color: textColor || '#000000'
              }}>
                {logoText}
              </h1>
            )}
          </div>

          {/* Navigation Links */}
          <nav>
            <ul style={{ 
              display: 'flex', 
              listStyle: 'none', 
              margin: '0', 
              padding: '0',
              gap: '24px'
            }}>
              {navLinks?.map((link: any, index: number) => (
                <li key={index}>
                  <a 
                    href={link.url || '#'} 
                    style={{ 
                      textDecoration: 'none',
                      color: textColor || '#000000',
                      fontWeight: '500',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {link.text || 'Link'}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>
      ),
      fields: {
        logo: { 
          type: 'custom', 
          label: 'Logo Image URL',
          render: ({ onChange, value }) => (
            <div>
              <input
                type="text"
                placeholder="Logo URL"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                style={{ width: '100%', marginBottom: '8px' }}
              />
              <input
                type="file"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('image', file);
            
                    const res = await fetch(`https://api.imgbb.com/1/upload?key=1a8e6e50c22ea42de12f3741b2ea605d`, {
                      method: 'POST',
                      body: formData,
                    });
            
                    const data = await res.json();
                    const url = data.data?.url;
                    if (url) {
                      onChange(url);
                    }
                  }
                }}
              />
            </div>
          )
        },
        logoText: { type: 'text', label: 'Logo Text' },
        navLinks: {
          type: 'array',
          label: 'Navigation Links',
          arrayFields: {
            text: { type: 'text', label: 'Link Text' },
            url: { type: 'text', label: 'Link URL' }
          }
        },
        backgroundColor: { type: 'text', label: 'Background Color' },
        textColor: { type: 'text', label: 'Text Color' },
        padding: { type: 'number', label: 'Padding (px)' },
        shadow: { 
          type: 'radio', 
          label: 'Add Shadow',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]
        },
        sticky: { 
          type: 'radio', 
          label: 'Sticky Header',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]
        },
        ...commonBoxFields
      },
      defaultProps: {
        logoText: 'My Website',
        navLinks: [
          { text: 'Home', url: '#' },
          { text: 'About', url: '#' },
          { text: 'Services', url: '#' },
          { text: 'Contact', url: '#' }
        ],
        backgroundColor: '#ffffff',
        textColor: '#000000',
        padding: 16,
        shadow: true,
        sticky: false,
        widthUnit: '%'
      }
    },
    Footer: {
      render: ({ 
        logo, 
        logoText, 
        sections, 
        backgroundColor, 
        textColor, 
        padding, 
        borderTop, 
        borderColor,
        socialLinks,
        copyrightText,
        ...rest 
      }) => (
        <footer 
          style={{ 
            ...commonBoxStyle(rest), 
            backgroundColor: backgroundColor || '#333333',
            color: textColor || '#ffffff',
            padding: padding ? `${padding}px` : '40px 16px',
            borderTop: borderTop ? `1px solid ${borderColor || '#555555'}` : 'none'
          }}
        >
          {/* Main Footer Content */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '32px',
            marginBottom: '32px'
          }}>
            {/* Logo Section */}
            <div>
              {logo && (
                <img 
                  src={logo} 
                  alt="Logo" 
                  style={{ 
                    height: '40px', 
                    width: 'auto', 
                    marginBottom: '16px' 
                  }} 
                />
              )}
              {logoText && (
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  margin: '0 0 16px 0',
                  color: textColor || '#ffffff'
                }}>
                  {logoText}
                </h3>
              )}
              <p style={{ 
                fontSize: '14px', 
                lineHeight: '1.6',
                margin: '0',
                opacity: '0.8'
              }}>
                Your company description or tagline goes here.
              </p>
            </div>

            {/* Dynamic Sections */}
            {sections?.map((section: any, index: number) => (
              <div key={index}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  margin: '0 0 16px 0',
                  color: textColor || '#ffffff'
                }}>
                  {section.title || 'Section'}
                </h4>
                <ul style={{ 
                  listStyle: 'none', 
                  margin: '0', 
                  padding: '0' 
                }}>
                  {section.links?.map((link: any, linkIndex: number) => (
                    <li key={linkIndex} style={{ marginBottom: '8px' }}>
                      <a 
                        href={link.url || '#'} 
                        style={{ 
                          textDecoration: 'none',
                          color: textColor || '#ffffff',
                          opacity: '0.8',
                          fontSize: '14px',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0.8';
                        }}
                      >
                        {link.text || 'Link'}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social Links */}
          {socialLinks && socialLinks.length > 0 && (
            <div style={{ 
              borderTop: `1px solid ${borderColor || '#555555'}`, 
              paddingTop: '24px',
              marginBottom: '24px'
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                margin: '0 0 16px 0',
                color: textColor || '#ffffff'
              }}>
                Follow Us
              </h4>
              <div style={{ display: 'flex', gap: '16px' }}>
                {socialLinks.map((social: any, index: number) => (
                  <a 
                    key={index}
                    href={social.url || '#'} 
                                         style={{ 
                       width: '40px',
                       height: '40px',
                       backgroundColor: 'rgba(255,255,255,0.1)',
                       borderRadius: '50%',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       textDecoration: 'none',
                       color: textColor || '#ffffff',
                       transition: 'background-color 0.2s'
                     }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    {social.icon || '🔗'}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Copyright */}
          <div style={{ 
            borderTop: `1px solid ${borderColor || '#555555'}`, 
            paddingTop: '24px',
            textAlign: 'center'
          }}>
            <p style={{ 
              fontSize: '14px', 
              margin: '0',
              opacity: '0.8'
            }}>
              {copyrightText || `© ${new Date().getFullYear()} Your Company. All rights reserved.`}
            </p>
          </div>
        </footer>
      ),
      fields: {
        logo: { 
          type: 'custom', 
          label: 'Logo Image URL',
          render: ({ onChange, value }) => (
            <div>
              <input
                type="text"
                placeholder="Logo URL"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                style={{ width: '100%', marginBottom: '8px' }}
              />
              <input
                type="file"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('image', file);
            
                    const res = await fetch(`https://api.imgbb.com/1/upload?key=1a8e6e50c22ea42de12f3741b2ea605d`, {
                      method: 'POST',
                      body: formData,
                    });
            
                    const data = await res.json();
                    const url = data.data?.url;
                    if (url) {
                      onChange(url);
                    }
                  }
                }}
              />
            </div>
          )
        },
        logoText: { type: 'text', label: 'Logo Text' },
        sections: {
          type: 'array',
          label: 'Footer Sections',
          arrayFields: {
            title: { type: 'text', label: 'Section Title' },
            links: {
              type: 'array',
              label: 'Section Links',
              arrayFields: {
                text: { type: 'text', label: 'Link Text' },
                url: { type: 'text', label: 'Link URL' }
              }
            }
          }
        },
        socialLinks: {
          type: 'array',
          label: 'Social Media Links',
          arrayFields: {
            icon: { type: 'text', label: 'Icon (emoji or text)' },
            url: { type: 'text', label: 'Social Media URL' }
          }
        },
        backgroundColor: { type: 'text', label: 'Background Color' },
        textColor: { type: 'text', label: 'Text Color' },
        padding: { type: 'number', label: 'Padding (px)' },
        borderTop: { 
          type: 'radio', 
          label: 'Show Top Border',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]
        },
        borderColor: { type: 'text', label: 'Border Color' },
        copyrightText: { type: 'text', label: 'Copyright Text' },
        ...commonBoxFields
      },
      defaultProps: {
        logoText: 'My Company',
        sections: [
          {
            title: 'Quick Links',
            links: [
              { text: 'Home', url: '#' },
              { text: 'About', url: '#' },
              { text: 'Services', url: '#' },
              { text: 'Contact', url: '#' }
            ]
          },
          {
            title: 'Services',
            links: [
              { text: 'Web Design', url: '#' },
              { text: 'Development', url: '#' },
              { text: 'Marketing', url: '#' },
              { text: 'Consulting', url: '#' }
            ]
          }
        ],
        socialLinks: [
          { icon: '📘', url: '#' },
          { icon: '🐦', url: '#' },
          { icon: '📷', url: '#' },
          { icon: '💼', url: '#' }
        ],
        backgroundColor: '#333333',
        textColor: '#ffffff',
        padding: 40,
        borderTop: true,
        borderColor: '#555555',
        copyrightText: '',
        widthUnit: '%'
      }
    },
    Divider: {
      render: ({ color, thickness, ...rest }) => (
        <hr style={{ ...commonBoxStyle(rest), border: 'none', borderBottom: `${thickness || 1}px solid ${color || '#000'}` }} />
      ),
      fields: {
        color: { type: 'text', label: 'Color' },
        thickness: { type: 'number', label: 'Thickness (px)' },
        ...commonBoxFields
      },
      defaultProps: {
        color: '#000',
        thickness: 1,
        widthUnit: '%'
      }
    },
    Spacer: {
      render: ({ size, ...rest }) => (
        <div style={{ ...commonBoxStyle(rest), height: `${size || 16}px` }} />
      ),
      fields: {
        size: { type: 'number', label: 'Height (px)' },
        ...commonBoxFields
      },
      defaultProps: {
        size: 16,
        widthUnit: '%'
      }
    }
  }
};

export default PuckConfig;