<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col cols="4">
          <v-treeview
            :items="treeItems"
            activatable
            open-on-click
            @update:active="updateActive"
          ></v-treeview>
        </v-col>

        <v-col cols="8">
          <v-card v-if="activeNode">
            <v-card-title>
              {{ activeNode.name }}
            </v-card-title>
            <!-- Add your card details here based on the selected node -->
            <v-card-text>
              <!-- Your card content here -->
            </v-card-text>
          </v-card>

          <div v-else>
            <v-alert color="info">
              Select a node in the tree to view details.
            </v-alert>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      treeItems: [
        {
          id: 1,
          name: 'Node 1',
          children: [
            { id: 2, name: 'Node 1.1' },
            { id: 3, name: 'Node 1.2' },
          ],
        },
        {
          id: 4,
          name: 'Node 2',
          children: [
            {
              id: 5,
              name: 'Node 2.1',
              children: [
                { id: 6, name: 'Node 2.1.1' },
                { id: 7, name: 'Node 2.1.2' },
              ],
            },
            { id: 8, name: 'Node 2.2' },
          ],
        },
      ],
      activeNode: null,
    };
  },
  methods: {
    updateActive(activeNodes) {
      const nodeId = activeNodes[0];
      if (nodeId !== undefined) {
        this.activeNode = this.findNodeById(this.treeItems, nodeId);
      } else {
        this.activeNode = null;
      }
    },
    findNodeById(nodes, id) {
      for (const node of nodes) {
        if (node.id === id) {
          return node;
        } else if (node.children) {
          const foundNode = this.findNodeById(node.children, id);
          if (foundNode) {
            return foundNode;
          }
        }
      }
      return null;
    },
  },
};
</script>
