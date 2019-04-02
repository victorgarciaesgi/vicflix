<template>
  <transition name="hide">
    <ul id="notifications-container" v-show="notificationList.length">
      <transition-group name="notification">
        <component
          :is="isLink(notification)"
          :to="notification.link"
          v-for="notification in notificationList"
          :key="notification.id"
          :type="notification.type"
          class="notification"
        >
          <div class="notification-icon">
            <img src="~@icons/notifications/success.svg" v-if="notification.type == 'success'" />
            <img src="~@icons/notifications/error.svg" v-else-if="notification.type == 'error'" />
            <img
              src="~@icons/notifications/warning.svg"
              v-else-if="notification.type == 'warning'"
            />
            <img
              src="~@icons/notifications/infos.svg"
              v-else-if="notification.type == 'notification'"
            />
          </div>
          <div class="notification-text">
            <span>{{ notification.message }}</span>
          </div>
          <div class="notification-quit" @click.prevent="deleteNotification(notification)">
            <img src="~@icons/notifications/quit.svg" />
          </div>
        </component>
      </transition-group>
    </ul>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { NotificationsModule } from '@modules';
import { INotification } from '@models';

@Component({})
export default class Notifications extends Vue {
  private deleteNotification = NotificationsModule.mutations.deleteNotification;

  get notificationList() {
    return NotificationsModule.state.notificationList;
  }

  get isLink() {
    return (notif: INotification) => {
      if (notif.link) {
        return 'router-link';
      }
      return 'li';
    };
  }
}
</script>



<style lang='scss' scoped>
ul#notifications-container {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 10px;
  width: 380px;
  max-width: 100%;
  height: auto;
  z-index: 10001;
  display: flex;
  flex-direction: column-reverse;

  .notification {
    position: relative;
    height: auto;
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    margin-bottom: 5px;
    padding: 13px 10px 13px 0px;
    box-shadow: 0 0 10px rgba(20, 20, 20, 0.2);
    font-size: 14px;
    color: white;
    text-align: center;
    font-weight: bold;
    border-radius: 3px;
    background-color: $g60;
    line-height: 17px;

    @at-root {
      a#{&} {
        cursor: pointer;
      }
    }

    div {
      display: flex;
      align-content: center;
      align-items: center;
      justify-content: center;

      &.notification-text {
        flex: 1 1 auto;
      }
      &.notification-icon {
        width: 50px;
        flex: 0 0 auto;
        img {
          height: 27px;
          width: 27px;
        }
      }

      &.notification-quit {
        width: 30px;
        cursor: pointer;
        flex: 0 0 auto;

        img {
          height: 20px;
          width: 20px;
        }
      }
    }
  }
}

.hide-leave-active {
  transition: all 0.6s;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s;
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(-130%);
}

.notification-enter {
  opacity: 0;
  transform: translateX(-100%);
}

.notification-enter-to {
  transform: translateX(0);
}
</style>

