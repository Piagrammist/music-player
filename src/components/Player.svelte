<script>
  import Info  from './Info.svelte'
  import Thumb from './Thumb.svelte'

  const music = new Audio('/demo/music.mp3')
  music.volume = 0.2

  let playIcon
  const togglePlayIcon = () => {
    playIcon.classList.toggle('fa-play')
    playIcon.classList.toggle('fa-pause')
  }

  function onPlayClick() {
    music.paused ? music.play() : music.pause()
    togglePlayIcon()
  }
</script>

<div class="container">
  <Thumb />
  <Info {music} on:togglePlayIcon={togglePlayIcon} />
  <div class="buttons">
    <button disabled>
      <i class="fas fa-step-backward"></i>
    </button>
    <button on:click={onPlayClick}>
      <i class="fas fa-play" bind:this={playIcon}></i>
    </button>
    <button disabled>
      <i class="fas fa-step-forward"></i>
    </button>
  </div>
</div>

<style lang=scss>
  @use 'sass:math';
  @use '../mixin.scss';

  .container {
    height:    fit-content;
    padding:   1rem;
    max-width: 420px;

    display:         flex;
    align-items:     center;
    flex-direction:  column;
    justify-content: flex-start;

    box-shadow:       0 0 20px rgba(255, 255, 255, 0.45);
    border-radius:    1px 35px 55px / 1px 55px 35px;
    background-color: #f5f5f5;
  }

  .buttons {
    display:        flex;
    align-items:    center;
    flex-direction: row;
  }

  button {
    @include mixin.flex-center;

    color:  #111;
    margin: 0.5em 0 0.1em;

    $btn-size:  2.6em;
    min-width:  $btn-size;
    max-width:  $btn-size;
    min-height: $btn-size;
    max-height: $btn-size;
  }

  $ico-size: 1.8rem;
  :global(.fa-play),
  :global(.fa-pause) {
    font-size:  $ico-size;
    transition: transform 120ms;

    &:hover {
      transform: scale(1.2);
    }
  }
  :global(.fa-pause) {
    font-size: $ico-size * 1.1;
  }
  :global(.fa-step-forward),
  :global(.fa-step-backward) {
    font-size: math.div($ico-size, 1.6);
  }
</style>
