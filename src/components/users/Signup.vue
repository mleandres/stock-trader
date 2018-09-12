<template>
  <div id="signup">
    <div class="signup-form">
      <h2>Sign Up</h2>
      <form @submit.prevent="submit">
        <div class="input" 
             :class="{invalid: $v.name.$error}">
          <label for="name">Your Name:</label>
          <input
            type="text"
            id="name"
            autocomplete="name"
            @blur="editField($v.name)"
            v-model="name">
          <p class="info-text">{{ nameInfoText }}
          </p>
        </div>
        <div class="input required"
             :class="{invalid: $v.email.$error}">
          <label for="email">Your Email:</label>
          <input
            type="email"
            id="email"
            autocomplete="email"
            @blur="editField($v.email)"
            v-model="email">
          <p class="info-text">{{ emailInfoText }}</p>
        </div>
        <div class="input required"
             :class="{invalid: $v.password.$error}">
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            autocomplete="new-password"
            @blur="$v.password.$touch()"
            v-model="password">
          <p class="info-text">{{ passwordInfoText }}</p>
        </div>
        <div class="input required"
             :class="{invalid: $v.confirmPassword.$error}">
          <label for="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            autocomplete="new-password"
            @blur="$v.confirmPassword.$touch()"
            v-model="confirmPassword">
          <p class="info-text">{{ confirmPasswordInfoText }}</p>
        </div>
        <div class="submit">
          <button class="button-small main-button" 
                  type="submit"
                  :disabled="$v.$invalid">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { alphaNum, maxLength, required, email, sameAs, minLength } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  mounted () {
    this.$v.$reset()
  },
  computed: {
    nameInfoText () {
      const field = this.$v.name
      if (field.$error) {
        if (!field.alphaNum) return "Your name cannot contain symbols or spaces"
        else if (!field.maxLength) return "Your name must be less than 20 characters"
      } else {
        return "Enter a name with a max of 20 characters"
      }
    },
    emailInfoText () {
      const field = this.$v.email
      if (field.$error) {
        if (!field.required) return "An email is required"
        else if (!field.email) return "Your email must be valid"
      } else {
        return "Any valid email address"
      }
    },
    passwordInfoText () {
      const field = this.$v.password
      if (field.$error) {
        if (!field.required) return "A password is required"
        else if (!field.minLen) return "Your password must be at least 6 characters"
        else if (!field.alphaNum) return "Your password cannot contain symbols or spaces"
      } else {
        return "An alphanumeric password with at least 6 characters"
      }
    },
    confirmPasswordInfoText () {
      const field = this.$v.confirmPassword
      if (field.$error) {
        if (!field.required) return "You must confirm your password"
        else if (!field.sameAs) return "Your passwords do not match"
      } else {
        return "Please confirm your password"
      }
    }
  },
  methods: {
    submit () {
      const userData = {
        name: this.name,
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('signup', userData)
    },
    editField (field) {
      field.$touch()
    }
  },
  validations: {
    name: {
      alphaNum,
      maxLen: maxLength(20)
    },
    email: {
      required,
      email
    },
    password: {
      required,
      alphaNum,
      minLen: minLength(6)
    },
    confirmPassword: {
      required,
      sameAs: sameAs(vm => vm.password)
    }
  },
  mounted () {
    document.title = "Sign up"
  }
}
</script>

<style scoped>
#signup {
  height: 100%;
}

.signup-form {
  border: #888 solid 2px;
  border-radius: 0.5em;
  padding: 0.5em 2em;
  box-shadow: 1px 2px #ccc;
}

.input {
  position: relative;
}

.input label {
  display: block;
}

.input input {
  font: inherit;
  width: 50%;
  padding: 0.2em 0.5em;
  box-sizing: border-box;
  border: 1px solid #bbb
}

.input, h2, .submit {
  margin: 1em;
}

.input p {
  text-align: left;
  font-size: 80%;
  color: #999
}

.input.invalid input {
  border: 1px solid red;
  background-color: lightsalmon;
}

.input.invalid p {
  color: red;
}

.required label::before {
  position: absolute;
  content: "*";
  color: red;
  left: -0.5em
}

</style>
