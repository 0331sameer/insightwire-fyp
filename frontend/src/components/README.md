# Category Features Components

This directory contains the new components implemented for the Category Detail Page enhancement project.

## Components

### 1. Analytics.jsx

Displays predictive analytics data with likelihood scores, summaries, and reasoning.

**Props:**

- `analytics`: Array of analytics objects with `id`, `title`, `likelihoodScore`, `summary`, and `reasoning`

**Features:**

- Color-coded likelihood scores (Very High, High, Medium, Low)
- Progress bars for visual score representation
- Collapsible reasoning sections
- Responsive grid layout

### 2. CategoryFlowchart.jsx

Renders a horizontal flowchart showing category hierarchy (parent → child relationships).

**Props:**

- `categories`: Array of category objects with `id` and `title`

**Features:**

- Clickable category pills for navigation
- Arrow indicators between categories
- Mobile-responsive stacked layout
- Accessibility support with aria-labels

### 3. ForceDirectedGraph.jsx

Creates an interactive force-directed graph using D3.js to visualize parent-child category relationships.

**Props:**

- `nodes`: Array of node objects with `id`, `title`, and `color`
- `links`: Array of link objects with `source` and `target`
- `width`: Graph width (default: 400)
- `height`: Graph height (default: 300)
- `onNodeClick`: Callback function for node click events

**Features:**

- D3.js force simulation for natural node positioning
- Directed arrows showing parent-child relationships
- Interactive nodes with click handlers
- Collision detection and centering forces

### 4. TestCategoryFeatures.jsx

Test component demonstrating all the new features with sample data.

## Integration

These components are integrated into the Category Detail Page (`frontend/src/pages/Category/[id]/page.jsx`) with the following features:

### 1. Image Banner + Category Button

- Full-width category image banner
- Parent category button in bottom-right corner
- Button is disabled (grayed out) when `Background` is "Not" or null
- Button navigates to parent category when enabled
- Tooltip shows "No parent category" or "Go to parent category"

### 2. Recursive Parent-Category Flowchart

- Follows up to 3 levels of parent categories
- Builds hierarchy by following `Background` field
- Stops early if "Not" or null is encountered
- Displays horizontal flowchart with clickable pills

### 3. Parent-Child Link Graph

- Fetches full JSON for each discovered category
- Builds force-directed graph showing relationships
- Color-coded nodes by hierarchy level
- Arrows point from child to parent

### 4. Analytics Display

- Shows prediction cards with likelihood scores
- Grid layout matching the design specifications
- Collapsible reasoning sections

### 5. Responsive & Accessibility

- All components collapse gracefully on mobile
- Flowchart stacks vertically on small screens
- All interactive elements have aria-labels
- Keyboard focus styles included

## API Endpoints

### New Backend Endpoint

- `GET /api/categories/:categoryId` - Returns single category with Background and Analytics fields

## Testing Considerations

The components should be tested for:

1. **Disabled button when no Background**

   - Button should be disabled when Background is "Not", "None", or null
   - Tooltip should show "No parent category"

2. **Correct flowchart nodes for 0-3 levels**

   - Empty hierarchy when no parents found
   - Proper hierarchy building up to 3 levels
   - Early termination on "Not" values

3. **Graph renders correct number of nodes/arcs**
   - Nodes array should match discovered categories
   - Links should connect child to parent
   - Color coding should reflect hierarchy level

## Dependencies

- `d3-force`: Force simulation engine
- `d3-selection`: DOM selection and manipulation
- `react-router-dom`: Navigation between categories

## Usage Example

```jsx
import CategoryFlowchart from './components/CategoryFlowchart';
import ForceDirectedGraph from './components/ForceDirectedGraph';
import Analytics from './components/Analytics';

// In your component
<Analytics analytics={categoryData.Analytics} />
<CategoryFlowchart categories={hierarchyData} />
<ForceDirectedGraph
  nodes={graphData.nodes}
  links={graphData.links}
  onNodeClick={(node) => navigate(`/category/${node.id}`)}
/>
```
