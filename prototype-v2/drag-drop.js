/**
 * Drag and Drop System for Cutout Pieces
 * Allows children to manipulate character figures and objects
 */

class DragDropSystem {
    constructor() {
        this.draggables = [];
        this.dropZones = [];
        this.currentDrag = null;
        this.dropResults = {}; // Store where items were dropped
    }

    /**
     * Create a draggable cutout
     */
    createDraggable(config) {
        const {
            id,
            imageUrl,
            initialX,
            initialY,
            width,
            height,
            container
        } = config;

        const element = document.createElement('img');
        element.src = imageUrl;
        element.id = id;
        element.className = 'draggable-cutout';
        element.draggable = true;
        element.style.left = initialX + 'px';
        element.style.top = initialY + 'px';
        element.style.width = width + 'px';
        element.style.height = height + 'px';

        // Drag event listeners
        element.addEventListener('dragstart', (e) => this.handleDragStart(e, id));
        element.addEventListener('dragend', (e) => this.handleDragEnd(e));

        container.appendChild(element);

        this.draggables.push({
            id,
            element,
            config
        });

        return element;
    }

    /**
     * Create a drop zone
     */
    createDropZone(config) {
        const {
            id,
            x,
            y,
            width,
            height,
            label,
            container
        } = config;

        const element = document.createElement('div');
        element.id = id;
        element.className = 'drop-zone';
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        element.style.width = width + 'px';
        element.style.height = height + 'px';

        if (label) {
            const labelElement = document.createElement('div');
            labelElement.textContent = label;
            labelElement.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 1.2em;
                color: #667eea;
                font-weight: 600;
                pointer-events: none;
            `;
            element.appendChild(labelElement);
        }

        // Drop event listeners
        element.addEventListener('dragover', (e) => this.handleDragOver(e));
        element.addEventListener('dragenter', (e) => this.handleDragEnter(e, id));
        element.addEventListener('dragleave', (e) => this.handleDragLeave(e, id));
        element.addEventListener('drop', (e) => this.handleDrop(e, id));

        container.appendChild(element);

        this.dropZones.push({
            id,
            element,
            config,
            hasItem: false,
            itemId: null
        });

        return element;
    }

    /**
     * Handle drag start
     */
    handleDragStart(e, itemId) {
        this.currentDrag = itemId;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', itemId);
    }

    /**
     * Handle drag end
     */
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.currentDrag = null;
    }

    /**
     * Handle drag over
     */
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    /**
     * Handle drag enter
     */
    handleDragEnter(e, zoneId) {
        e.preventDefault();
        const zone = this.dropZones.find(z => z.id === zoneId);
        if (zone && !zone.hasItem) {
            zone.element.classList.add('active');
        }
    }

    /**
     * Handle drag leave
     */
    handleDragLeave(e, zoneId) {
        const zone = this.dropZones.find(z => z.id === zoneId);
        if (zone) {
            zone.element.classList.remove('active');
        }
    }

    /**
     * Handle drop
     */
    handleDrop(e, zoneId) {
        e.preventDefault();

        const itemId = e.dataTransfer.getData('text/plain');
        const zone = this.dropZones.find(z => z.id === zoneId);
        const draggable = this.draggables.find(d => d.id === itemId);

        if (!zone || !draggable) return;

        // Remove active class
        zone.element.classList.remove('active');

        // If zone already has an item, don't allow drop
        if (zone.hasItem) {
            return;
        }

        // Move the draggable to the drop zone
        const zoneRect = zone.element.getBoundingClientRect();
        const containerRect = draggable.element.parentElement.getBoundingClientRect();

        draggable.element.style.left = (zoneRect.left - containerRect.left + zoneRect.width / 2 - draggable.config.width / 2) + 'px';
        draggable.element.style.top = (zoneRect.top - containerRect.top + zoneRect.height / 2 - draggable.config.height / 2) + 'px';

        // Update zone status
        zone.hasItem = true;
        zone.itemId = itemId;
        zone.element.classList.add('has-item');

        // Record the drop
        this.dropResults[itemId] = zoneId;

        // Trigger callback if exists
        if (zone.config.onDrop) {
            zone.config.onDrop(itemId, zoneId);
        }

        console.log(`Dropped ${itemId} into ${zoneId}`);
    }

    /**
     * Get drop results
     */
    getDropResults() {
        return this.dropResults;
    }

    /**
     * Check if all required items are dropped
     */
    allItemsDropped(requiredItems) {
        return requiredItems.every(itemId => this.dropResults[itemId]);
    }

    /**
     * Reset the drag-drop system
     */
    reset() {
        this.draggables.forEach(d => d.element.remove());
        this.dropZones.forEach(z => z.element.remove());
        this.draggables = [];
        this.dropZones = [];
        this.currentDrag = null;
        this.dropResults = {};
    }
}

// Global instance
const dragDropSystem = new DragDropSystem();
