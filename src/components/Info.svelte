<script>
  export let music

  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  const formatSeconds = seconds => {
    const minutes = Math.floor(seconds / 60)
    seconds = Math.floor(seconds % 60)
    let minutesString =
      minutes < 10 ? '0' + minutes.toString() : minutes.toString()
    let secondsString =
      seconds < 10 ? '0' + seconds.toString() : seconds.toString()
    return `${minutesString}:${secondsString}`
  }

  let duration, now, ribbon
  music.addEventListener('loadedmetadata', () => {
    now.innerText      = formatSeconds(music.currentTime)
    duration.innerText = formatSeconds(music.duration)
    ribbon.max      = Math.floor(music.duration).toString()
    ribbon.disabled = false
  })
  music.addEventListener('timeupdate', () => {
    now.innerText = formatSeconds(music.currentTime)
    ribbon.value  = music.currentTime.toString()
  })
  music.addEventListener('ended', () => {
    ribbon.value  = '0'
    now.innerText = formatSeconds(0)
    dispatch('togglePlayIcon')
  })

  function onChange() {
    music.currentTime = parseInt(this.value)
    if (music.paused) {
      music.play()
      dispatch('togglePlayIcon')
    }
  }
  function onInput() {
    if (!music.paused) {
      music.pause()
      dispatch('togglePlayIcon')
    }
    now.innerText = formatSeconds(parseInt(this.value))
  }
</script>

<div style="width: 100%;">
  <div id=info>
    <div id=name>Safe</div>
    <div id=author>Dallic</div>
  </div>

  <div id=time>
    <span id=now bind:this={now}>00:00</span>
    <input type=range min=0 value=0 disabled
      bind:this={ribbon}
      on:change={onChange}
      on:input={onInput}
    >
    <span id=duration bind:this={duration}>00:00</span>
  </div>
</div>

<style lang=scss>
  @use '../mixin';

  #info {
    width:      inherit;
    margin:     0.8em 0;
    min-height: 2.4em;
    text-align: center;
  }
  #name {
    font-size: 1.2rem;
    font-weight: bold;
  }
  #author {
    font-size: 0.8rem;
  }

  #time {
    @include mixin.flex-center;

    width:  inherit;
    height: 20px;
  }
  #now, #duration {
    color:       #000;
    font-size:   0.8rem;
    font-weight: bold;
  }

  @mixin thumb {
    @include mixin.clear;

    width:        11px;
    aspect-ratio: 1;

    transition:       transform 200ms;
    box-shadow:       0 0 5px rgba(0, 0, 0, 0.2);
    border-radius:    50%;
    background-color: #111;

    &:hover {
      transform: scale(1.5);
    }
  }
  @mixin track {
    height:           3px;
    background-color: #666;
  }
  input[type=range] {
    @include mixin.clear;

    width:  55%;
    height: 100%;
    margin: 0 0.75em;

    &::-moz-range-thumb     { @include thumb; }
    &::-webkit-slider-thumb {
      @include thumb;
      margin-top: -3.32px;
    }

    &::-moz-range-track              { @include track; }
    &::-webkit-slider-runnable-track { @include track; }

    &:disabled {
      &::-moz-range-thumb:hover     { transform: none; }
      &::-webkit-slider-thumb:hover { transform: none; }
    }
  }
</style>
