import { create } from 'zustand';
import { Node, Edge, Connection } from '@xyflow/react';

// Define node types for the bioinformatics platform
export type NodeType = 
  | 'protein-fetch'
  | 'text-prompt'
  | 'protein-variant'
  | 'protein-prompt-processor'
  | 'protein-visualizer'
  | 'protein-molecule-dock'
  | 'protein-molecule-affinity'
  | 'molecule-fetch';

export interface NodeTypeDefinition {
  id: NodeType;
  name: string;
  description: string;
  category: 'protein' | 'molecule' | 'analysis' | 'utility';
  inputs: Array<{
    id: string;
    name: string;
    type: string;
    required: boolean;
  }>;
  outputs: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

export interface WorkflowTab {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  isActive: boolean;
}

export interface BioinformaticsStore {
  // UI State
  sidebarOpen: boolean;
  darkMode: boolean;
  
  // Workflow State
  workflows: WorkflowTab[];
  activeWorkflowId: string;
  
  // Node definitions
  nodeTypes: NodeTypeDefinition[];
  
  // Actions
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  
  // Workflow actions
  createWorkflow: (name: string) => void;
  deleteWorkflow: (id: string) => void;
  setActiveWorkflow: (id: string) => void;
  updateWorkflowName: (id: string, name: string) => void;
  
  // Node and edge actions
  addNode: (workflowId: string, node: Node) => void;
  updateNode: (workflowId: string, nodeId: string, updates: Partial<Node>) => void;
  deleteNode: (workflowId: string, nodeId: string) => void;
  addEdge: (workflowId: string, edge: Edge) => void;
  updateEdge: (workflowId: string, edgeId: string, updates: Partial<Edge>) => void;
  deleteEdge: (workflowId: string, edgeId: string) => void;
  
  // Get current workflow
  getCurrentWorkflow: () => WorkflowTab | undefined;
}

// Initial node type definitions
const initialNodeTypes: NodeTypeDefinition[] = [
  {
    id: 'protein-fetch',
    name: 'Fetch Protein',
    description: 'Fetch protein information from UniProt database',
    category: 'protein',
    inputs: [
      { id: 'uniprot_id', name: 'UniProt ID', type: 'string', required: true }
    ],
    outputs: [
      { id: 'protein_data', name: 'Protein Data', type: 'protein' }
    ]
  },
  {
    id: 'text-prompt',
    name: 'Text Prompt',
    description: 'Create text prompts for various workflow components',
    category: 'utility',
    inputs: [],
    outputs: [
      { id: 'prompt_text', name: 'Prompt Text', type: 'string' }
    ]
  },
  {
    id: 'protein-variant',
    name: 'Protein Variant Creator',
    description: 'Create variants of existing proteins',
    category: 'protein',
    inputs: [
      { id: 'protein_data', name: 'Protein Data', type: 'protein', required: true },
      { id: 'variant_instructions', name: 'Variant Instructions', type: 'string', required: true }
    ],
    outputs: [
      { id: 'variant_protein', name: 'Variant Protein', type: 'protein' }
    ]
  },
  {
    id: 'protein-prompt-processor',
    name: 'Protein-Prompt Processor',
    description: 'Process protein data with text prompts',
    category: 'analysis',
    inputs: [
      { id: 'protein_data', name: 'Protein Data', type: 'protein', required: true },
      { id: 'prompt_text', name: 'Prompt Text', type: 'string', required: true }
    ],
    outputs: [
      { id: 'processed_result', name: 'Processed Result', type: 'analysis' }
    ]
  },
  {
    id: 'protein-visualizer',
    name: 'Protein Visualizer',
    description: 'Visualize protein structures',
    category: 'analysis',
    inputs: [
      { id: 'protein_data', name: 'Protein Data', type: 'protein', required: true }
    ],
    outputs: [
      { id: 'visualization', name: 'Visualization', type: 'image' }
    ]
  },
  {
    id: 'protein-molecule-dock',
    name: 'Protein-Molecule Docking',
    description: 'Dock molecules to protein structures',
    category: 'analysis',
    inputs: [
      { id: 'protein_data', name: 'Protein Data', type: 'protein', required: true },
      { id: 'molecule_data', name: 'Molecule Data', type: 'molecule', required: true }
    ],
    outputs: [
      { id: 'docking_result', name: 'Docking Result', type: 'docking' }
    ]
  },
  {
    id: 'protein-molecule-affinity',
    name: 'Affinity Calculator',
    description: 'Calculate binding affinity between proteins and molecules',
    category: 'analysis',
    inputs: [
      { id: 'protein_data', name: 'Protein Data', type: 'protein', required: true },
      { id: 'molecule_data', name: 'Molecule Data', type: 'molecule', required: true }
    ],
    outputs: [
      { id: 'affinity_score', name: 'Affinity Score', type: 'number' }
    ]
  },
  {
    id: 'molecule-fetch',
    name: 'Fetch Molecule',
    description: 'Fetch molecule information from PubChem database',
    category: 'molecule',
    inputs: [
      { id: 'pubchem_id', name: 'PubChem ID', type: 'string', required: true }
    ],
    outputs: [
      { id: 'molecule_data', name: 'Molecule Data', type: 'molecule' }
    ]
  }
];

export const useBioinformaticsStore = create<BioinformaticsStore>((set, get) => ({
  // Initial state
  sidebarOpen: true,
  darkMode: true,
  workflows: [
    {
      id: 'workflow-1',
      name: 'Workflow 1',
      nodes: [],
      edges: [],
      isActive: true
    }
  ],
  activeWorkflowId: 'workflow-1',
  nodeTypes: initialNodeTypes,
  
  // Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  
  // Workflow actions
  createWorkflow: (name: string) => {
    const newWorkflow: WorkflowTab = {
      id: `workflow-${Date.now()}`,
      name,
      nodes: [],
      edges: [],
      isActive: false
    };
    set((state) => ({
      workflows: [...state.workflows, newWorkflow]
    }));
  },
  
  deleteWorkflow: (id: string) => {
    set((state) => {
      const workflows = state.workflows.filter(w => w.id !== id);
      let activeWorkflowId = state.activeWorkflowId;
      
      // If we deleted the active workflow, switch to another one
      if (activeWorkflowId === id && workflows.length > 0) {
        activeWorkflowId = workflows[0].id;
        workflows[0].isActive = true;
      }
      
      return { workflows, activeWorkflowId };
    });
  },
  
  setActiveWorkflow: (id: string) => {
    set((state) => ({
      activeWorkflowId: id,
      workflows: state.workflows.map(w => ({
        ...w,
        isActive: w.id === id
      }))
    }));
  },
  
  updateWorkflowName: (id: string, name: string) => {
    set((state) => ({
      workflows: state.workflows.map(w => 
        w.id === id ? { ...w, name } : w
      )
    }));
  },
  
  // Node and edge actions
  addNode: (workflowId: string, node: Node) => {
    set((state) => ({
      workflows: state.workflows.map(w => 
        w.id === workflowId 
          ? { ...w, nodes: [...w.nodes, node] }
          : w
      )
    }));
  },
  
  updateNode: (workflowId: string, nodeId: string, updates: Partial<Node>) => {
    set((state) => ({
      workflows: state.workflows.map(w => 
        w.id === workflowId 
          ? {
              ...w,
              nodes: w.nodes.map(n => 
                n.id === nodeId ? { ...n, ...updates } : n
              )
            }
          : w
      )
    }));
  },
  
  deleteNode: (workflowId: string, nodeId: string) => {
    set((state) => ({
      workflows: state.workflows.map(w => 
        w.id === workflowId 
          ? {
              ...w,
              nodes: w.nodes.filter(n => n.id !== nodeId),
              edges: w.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
            }
          : w
      )
    }));
  },
  
  addEdge: (workflowId: string, edge: Edge) => {
    set((state) => ({
      workflows: state.workflows.map(w => 
        w.id === workflowId 
          ? { ...w, edges: [...w.edges, edge] }
          : w
      )
    }));
  },
  
  updateEdge: (workflowId: string, edgeId: string, updates: Partial<Edge>) => {
    set((state) => ({
      workflows: state.workflows.map(w => 
        w.id === workflowId 
          ? {
              ...w,
              edges: w.edges.map(e => 
                e.id === edgeId ? { ...e, ...updates } : e
              )
            }
          : w
      )
    }));
  },
  
  deleteEdge: (workflowId: string, edgeId: string) => {
    set((state) => ({
      workflows: state.workflows.map(w => 
        w.id === workflowId 
          ? { ...w, edges: w.edges.filter(e => e.id !== edgeId) }
          : w
      )
    }));
  },
  
  // Get current workflow
  getCurrentWorkflow: () => {
    const state = get();
    return state.workflows.find(w => w.id === state.activeWorkflowId);
  }
})); 