"use client";

import React, { useEffect, useCallback } from 'react';
import { useBioinformaticsStore } from '@/lib/store';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/ui/sidebar';
import { Play, Settings, Save, FolderOpen, Plus, X } from 'lucide-react';
import { WorkflowCanvas } from './WorkflowCanvas';
import { NodeSidebar } from './NodeSidebar';
import { cn } from '@/lib/utils';

export function BioinformaticsContainer() {
  const {
    sidebarOpen,
    darkMode,
    workflows,
    activeWorkflowId,
    toggleSidebar,
    toggleDarkMode,
    createWorkflow,
    deleteWorkflow,
    setActiveWorkflow,
    updateWorkflowName,
  } = useBioinformaticsStore();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault();
        toggleSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const handleCreateWorkflow = useCallback(() => {
    const name = `Workflow ${workflows.length + 1}`;
    createWorkflow(name);
  }, [createWorkflow, workflows.length]);

  const handleDeleteWorkflow = useCallback((workflowId: string) => {
    if (workflows.length > 1) {
      deleteWorkflow(workflowId);
    }
  }, [deleteWorkflow, workflows.length]);

  const handleRunWorkflow = useCallback(() => {
    // TODO: Implement workflow execution
    console.log('Running workflow:', activeWorkflowId);
  }, [activeWorkflowId]);

  return (
    <div className={cn("h-screen flex flex-col", darkMode ? "dark" : "")}>
      {/* Menubar */}
      <div className="border-b bg-background">
        <Menubar className="border-none">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handleCreateWorkflow}>
                <Plus className="mr-2 h-4 w-4" />
                New Workflow
              </MenubarItem>
              <MenubarItem>
                <FolderOpen className="mr-2 h-4 w-4" />
                Open Workflow
              </MenubarItem>
              <MenubarItem>
                <Save className="mr-2 h-4 w-4" />
                Save Workflow
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={toggleSidebar}>
                Toggle Sidebar (Ctrl+B)
              </MenubarItem>
              <MenubarItem onClick={toggleDarkMode}>
                Toggle Dark Mode
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          
          <MenubarMenu>
            <MenubarTrigger>Tools</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          
          <div className="ml-auto flex items-center space-x-2 px-4">
            <Button onClick={handleRunWorkflow} variant="default" size="sm">
              <Play className="mr-2 h-4 w-4" />
              Run
            </Button>
          </div>
        </Menubar>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 border-r bg-background">
            <NodeSidebar />
          </div>
        )}

        {/* Workflow Area */}
        <div className="flex-1 flex flex-col">
          {/* Workflow Tabs */}
          <div className="border-b bg-background">
            <Tabs value={activeWorkflowId} onValueChange={setActiveWorkflow}>
              <div className="flex items-center px-4 py-2">
                <TabsList className="h-9">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="flex items-center">
                      <TabsTrigger value={workflow.id} className="relative pr-8">
                        {workflow.name}
                        {workflows.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteWorkflow(workflow.id);
                            }}
                            className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </TabsTrigger>
                    </div>
                  ))}
                </TabsList>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCreateWorkflow}
                  className="ml-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </Tabs>
          </div>

          {/* Workflow Canvas */}
          <div className="flex-1 relative">
            <WorkflowCanvas />
          </div>
        </div>
      </div>
    </div>
  );
} 