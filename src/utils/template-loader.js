// Template Loader - Loads and processes HTML templates
class TemplateLoader {
    constructor() {
        this.templates = {};
        this.templatePath = 'templates/';
    }

    // Load a template file
    async loadTemplate(templateName) {
        if (this.templates[templateName]) {
            return this.templates[templateName];
        }

        try {
            const response = await fetch(`${this.templatePath}${templateName}.html`);
            if (!response.ok) {
                throw new Error(`Template ${templateName} not found`);
            }
            const template = await response.text();
            this.templates[templateName] = template;
            return template;
        } catch (error) {
            console.error(`Error loading template ${templateName}:`, error);
            return '';
        }
    }

    // Simple template rendering - replaces {{variable}} with data values
    // Supports basic conditionals: {{#condition}}content{{/condition}}
    render(template, data) {
        let result = template;

        // Process conditionals/iterations recursively from innermost to outermost
        // Keep processing until no more matches
        let previousResult;
        do {
            previousResult = result;
            result = result.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, content) => {
                const value = data[key];
                if (Array.isArray(value)) {
                    // Render content for each array item
                    return value.map(item => {
                        let itemResult = content;
                        
                        // First handle nested conditionals for this item
                        itemResult = itemResult.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (nestedMatch, nestedKey, nestedContent) => {
                            return item[nestedKey] ? nestedContent : '';
                        });
                        
                        // Then replace variables in the item content
                        Object.keys(item).forEach(itemKey => {
                            const regex = new RegExp(`\\{\\{${itemKey}\\}\\}`, 'g');
                            itemResult = itemResult.replace(regex, this.escapeHtml(item[itemKey]));
                        });
                        return itemResult;
                    }).join('');
                } else if (value) {
                    // Boolean conditional - show content if truthy
                    return content;
                } else {
                    // Falsy value - hide content
                    return '';
                }
            });
        } while (result !== previousResult); // Keep processing until stable
        
        // Handle regular variable substitution
        result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] !== undefined ? this.escapeHtml(data[key]) : '';
        });

        return result;
    }

    // Render template for each item in an array
    async renderArray(templateName, dataArray) {
        const template = await this.loadTemplate(templateName);
        return dataArray.map(data => this.render(template, data)).join('');
    }

    // Helper to escape HTML
    escapeHtml(text) {
        if (typeof text !== 'string') return text;
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Preload multiple templates
    async preloadTemplates(templateNames) {
        const promises = templateNames.map(name => this.loadTemplate(name));
        await Promise.all(promises);
    }
}

// Create a global instance
const templateLoader = new TemplateLoader();

// Make available globally
if (typeof global !== 'undefined') {
    global.TemplateLoader = TemplateLoader;
    global.templateLoader = templateLoader;
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TemplateLoader, templateLoader };
}
