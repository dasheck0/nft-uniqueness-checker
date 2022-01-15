<template>
  <div class="container">
    <div class="form-group">
      <label for="drawCount" class="mb-2">How many NFTs do you want to generate?</label>
      <input v-model="drawCount" class="form-control form-control-sm" id="drawCount" />
    </div>

    <div class="row mt-5 justify-content-between">
      <div class="col">How many layers do you have?</div>
      <div class="col-auto"><button class="btn btn-sm btn-primary" @click="addLayer">Add layer</button></div>
    </div>

    <div class="row mt-2 mb-4 text-muted">
      <div class="col-1"></div>
      <div class="col"><small v-tooltip="'Name of the layer'">Name</small></div>
      <div class="col">
        <small
          v-tooltip="
            'How many different states can this layer have (i.e. Mouth opened, Mouth closed, Mouth with teeth, ...)'
          "
          >State count</small
        >
      </div>
    </div>

    <div class="row mb-2" v-for="i in layerCount" :key="i">
      <div class="col-1">
        <img src="/images/trash.svg" class="trash" @click="() => removeLayer(i - 1)" v-tooltip="'Delete layer'" />
      </div>
      <div class="col">
        <div class="form-group">
          <input v-model="names[i - 1]" class="form-control form-control-sm" :id="'name' + i" />
        </div>
      </div>
      <div class="col">
        <div class="form-group">
          <input v-model="stateCounts[i - 1]" class="form-control form-control-sm" :id="'state' + i" />
        </div>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col">
        Chance of getting duplicates:
        <div class="result" :style="cssVariables">{{ formatPercent(chanceForDuplicates) }}</div>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col">
        <div class="divider"></div>
      </div>
    </div>

    <div class="row mt-2 text-muted">
      <div class="col">
        <small>
          Since we are dealing with probabilities, you can still get a unique collection even if the probability of
          duplicates is high. Also we assumed that states within layers are evenly distributed. This might not be the
          case in general, however this approach gives a close enough prediction and is sufficient for our purposes. See
          this
          <a href="https://dev.to/dasheck0/how-to-check-how-unique-your-nft-collection-really-is-15be" target="_blank"
            >article</a
          >
          for more details.
        </small>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      layerCount: 5,
      stateCounts: [10, 10, 10, 10, 10],
      names: ['Eyes', 'Nose', 'Mouth', 'Ears', 'Background'],
      drawCount: 10000,
    };
  },
  computed: {
    poolSize(): number {
      return this.stateCounts.reduce((a, b) => a * b, 1);
    },
    chanceForDuplicates(): number {
      let result = 1;

      for (let i = 0; i < this.drawCount; i++) {
        result = (result * (this.poolSize - i)) / this.poolSize;
      }

      return 1 - result;
    },
    cssVariables(): any {
      let color = '#89d0d2';

      if (this.chanceForDuplicates > 0.2) {
        color = '#f1c45e';
      }

      if (this.chanceForDuplicates > 0.65) {
        color = '#d37070';
      }

      return {
        '--result-color': color,
      };
    },
  },
  methods: {
    formatPercent(value: number) {
      return `${(value * 100).toFixed(2)}%`;
    },
    addLayer() {
      this.layerCount += 1;
      this.stateCounts.push(1);
      this.names.push('Untitled');
    },
    removeLayer(index: number) {
      if (this.layerCount > 0 && index <= this.layerCount) {
        this.stateCounts.splice(index, 1);
        this.names.splice(index, 1);
        this.layerCount -= 1;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  max-width: 600px;
  margin: 100px auto;
  padding: 50px;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  .title {
    font-size: 0.8em;
    font-weight: bold;
    color: #666;
  }

  .trash {
    cursor: pointer;
  }

  .divider {
    background-color: #d2d2d2;
    height: 1px;
  }

  .result {
    font-size: 1.5em;
    font-weight: bold;
    color: var(--result-color);
  }
}
</style>
