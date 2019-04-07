<template>
  <div class="browse flex column w100">
    <div class="main-banner">
      <img src="@images/home_image.jpg" alt>
      <div class="title-wrapper flex column">
        <div class="title">Original Vicflix</div>
        <div class="serieName">Victor Garcia</div>
        <div class="buttons flex">
          <VButton>
            <SvgIcon
              src="icons/actions/play.svg"
              color="white"
              :size="22"
              :style="{ marginRight: '5px' }"
            />
            <span>Découvrir</span>
          </VButton>
        </div>
      </div>
    </div>
    <section>
      <Slider :slides="projectsSliderItems" title="Projects"/>
    </section>
    <section>
      <Slider :slides="projectsSliderItems" title="Projects"/>
    </section>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Slider } from '@components';
import { ISlideItem } from '../../models';

@Component({
  components: {
    Slider,
  },
})
export default class Browse extends Vue {
  private projectsSliderItems: ISlideItem[] = [
    {
      id: 1,
      title: 'Test',
      image: require('@images/projects/bigup.png'),
      technos: ['Vue', 'Graphql', 'Typescript'],
      type: 'Project',
    },
    {
      id: 2,
      title: 'Test',
      image: require('@images/projects/bigup.png'),
      technos: ['Vue', 'Graphql', 'Typescript'],
      type: 'Project',
    },
    {
      id: 3,
      title: 'Test',
      image: require('@images/projects/bigup.png'),
      technos: ['Vue', 'Graphql', 'Typescript'],
      type: 'Project',
    },
    {
      id: 4,
      title: 'Test',
      image: require('@images/projects/bigup.png'),
      technos: ['Vue', 'Graphql', 'Typescript'],
      type: 'Project',
    },
    {
      id: 5,
      title: 'Test',
      image: require('@images/projects/bigup.png'),
      technos: ['Vue', 'Graphql', 'Typescript'],
      type: 'Project',
    },
    {
      id: 6,
      title: 'Test',
      image: require('@images/projects/bigup.png'),
      technos: ['Vue', 'Graphql', 'Typescript'],
      type: 'Project',
    },
    {
      id: 7,
      title: 'Test',
      image: require('@images/projects/bigup.png'),
      technos: ['Vue', 'Graphql', 'Typescript'],
      type: 'Project',
    },
    {
      id: 8,
      title: 'Test',
      image: require('@images/projects/bigup.png'),
      technos: ['Vue', 'Graphql', 'Typescript'],
      type: 'Project',
    },
    {
      id: 9,
      title: 'Test',
      image: require('@images/projects/bigup.png'),
      technos: ['Vue', 'Graphql', 'Typescript'],
      type: 'Project',
    },
  ];
}
</script>



<style lang="scss" scoped>
div.browse {
  height: 100%;
  div.main-banner {
    position: relative;
    max-height: 70vh;
    min-height: 15vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    mask-image: linear-gradient(rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0) 100%);

    div.title-wrapper {
      position: absolute;
      top: 50%;
      transform: translateY(-55%);
      padding-left: 5%;

      div.title {
        font-size: 30px;
        font-weight: bold;
        margin-bottom: 5x;
        text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }

      div.serieName {
        font-size: 40px;
        font-weight: bold;
        margin-bottom: 10px;
        text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }
    }

    img {
      max-width: 100%;
      width: 100%;
      height: auto;
    }
  }
}
</style>
