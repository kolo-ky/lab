<template lang="pug">
  .col-md-8.align-self-center.content_koment
    .file_download(style="text-align: right; padding-right: 2em;")
      a(href="#" @click.prevent="getDocument('xls')")
        | Скачать отчет
        img(src="../../../assets/doc_xls.png")
    .row.justify-content-md-center.analiz_content
      .col-sm-12.align-self-center
        div(v-if="nodesAreMissing") Данные не сформированы, обратитесь в этот раздел позже
        network(
          :nodes="nodes"
          :edges="edges"
          :options="options"
          @click="oneClick"
        ).network
</template>

<script>
import fileSaver from 'file-saver';
import Network from 'vue2vis/src/components/Network.vue';

export default {
  name: 'communication',
  components: { Network },
  data() {
    return {
      nodesAreMissing: false,
      showPreLoad: false,
      networkData: '',
      nodes: [
        { id: 17950899, label: 'Загрузка...' },
        { id: 17100899, label: 'Загрузка...' },
        { id: 20950899, label: 'Загрузка...' },
      ],
      edges: [
        { id: 1, from: 17950899, to: 17100899 },
        { id: 2, from: 17100899, to: 20950899 },
        { id: 3, from: 20950899, to: 17950899 },
      ],
      options: {
        nodes: {
          shape: 'circle',
        },
        edges: {
          smooth: {
            type: 'continuous',
            forceDirection: 'none',
            roundness: 1,
          },
        },
        physics: {
          maxVelocity: 20,
          enabled: true,
          repulsion: {
            centralGravity: 20,
            springLength: 20,
            springConstant: 5,
            nodeDistance: 10,
            damping: 1,
          },
          stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 100,
            onlyDynamicEdges: false,
            fit: true,
          },
        },
      },
      networkEvents: '',
      result: [],
      delay: 500,
      clicks: 0,
      timer: null,
    };
  },
  methods: {
    oneClick(data) {
      this.clicks += 1;
      if (this.clicks === 1) {
        const self = this;
        this.timer = setTimeout(() => {
          self.result.push(data.event.type);
          self.clicks = 0;
        }, this.delay);
      } else {
        clearTimeout(this.timer);
        this.nodes.forEach((node) => {
          if (Number(node.id) === Number(data.nodes[0])) {
            this.openInNewTab(`${node.url}`);
          }
        });
        console.log(data.nodes[0]);
        this.clicks = 0;
      }
    },
    openInNewTab(url) {
      const win = window.open(url, '_blank');
      win.focus();
    },
    getDocument(type) {
      this.$http.post('/stats/analytics/download', {
        request_id: this.$route.params.id,
        offset: 1,
        limit: 1000,
      }, { responseType: 'blob' })
        .then((resp) => {
          fileSaver.saveAs(new Blob([resp.data]), `Report.${type}`);
        })
        .catch(err => err);
    },
    getDataForNetwork() {
      this.showPreLoad = !this.showPreLoad;
      this.$http.post('/stats/analytics', {
        request_id: this.$route.params.id,
        offset: 1,
        limit: 1000,
      })
        .then((resp) => {
          this.showPreLoad = !this.showPreLoad;
          this.networkData = resp.data;
        })
        .then(() => {
          this.createNodesAndEdgesForNetwork();
        })
        .catch(err => err);
    },
    createNodesAndEdgesForNetwork() {
      const nodes = [];
      const edges = [];
      const testArr = [];
      this.networkData.slave.forEach((slave) => {
        const node = {};
        node.id = slave.id;
        node.label = slave.name;
        node.size = slave.weight / 2;
        node.shape = 'circularImage';
        node.image = slave.image || '';
        node.mass = (100 - slave.weight) / 5;
        node.url = slave.url;
        slave.connections.forEach((connection) => {
          const edge = {};
          edge.from = Number(node.id);
          edge.to = Number(connection.id);
          edge.id = node.id * 1000000 + connection.id;
          edges.push(edge);
          this.networkData.leading.forEach((lead) => {
            if (lead.id === connection.id && !(testArr.indexOf(connection.id) + 1)) {
              testArr.push(connection.id);
              const node2 = {};
              node2.id = Number(lead.id);
              node2.label = lead.name;
              node2.size = 120;
              node2.shape = 'circularImage';
              node2.image = lead.image || '';
              node2.mass = 100;
              node2.url = lead.url;
              nodes.push(node2);
            }
          });
        });
        nodes.push(node);
        if (this.networkData.count === 0) {
          this.nodesAreMissing = true;
        }
      });
      this.nodes = nodes;
      this.edges = edges;
    },
  },
  mounted() {
    this.getDataForNetwork();
  },
};
</script>

<style lang="stylus">
@import "~vis/dist/vis.min.css"
.network
  height 70vh
</style>
