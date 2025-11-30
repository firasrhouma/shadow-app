import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-slider-main',
  standalone: true,
  imports: [CarouselModule, CommonModule],
  templateUrl: './slider-main.component.html',
  styleUrls: ['./slider-main.component.css'],
})
export class SliderMainComponent implements OnInit, OnDestroy {
  mainOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 500,
    navText: ['', ''],
    responsive: {
      0: { items: 1 },
      400: { items: 1 },
      740: { items: 1 },
      940: { items: 1 },
      1200: { items: 1 },
    },
    nav: false,
    autoplay: true,  // turn off carousel autoplay, since image spins internally
    autoplayHoverPause: true,
    animateOut: 'slideOutLeft',
     animateIn: 'slideInLeft',
     smartSpeed: 1000
  };

  images = ['/images/bed1.jpg', '/images/matelat2.jpg'];
  currentIndex = 0;
  currentImage = this.images[this.currentIndex];
  intervalId: any;

  ngOnInit() {
    // Change image every 5 seconds (match CSS animation duration)
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.currentImage = this.images[this.currentIndex];
    }, 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
