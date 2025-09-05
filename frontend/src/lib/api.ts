const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Initialize token from localStorage
    this.initializeToken();
  }

  private initializeToken() {
    try {
      const authData = localStorage.getItem('mlda-auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        this.token = parsed.state?.token || null;
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
      this.token = null;
    }
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) {
    return this.request<{ user: any; token: string; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request<{ user: any }>('/auth/profile');
  }

  async updateProfile(updates: any) {
    return this.request<{ user: any; message: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Course endpoints
  async getCourses(params?: {
    page?: number;
    limit?: number;
    level?: string;
    status?: string;
    featured?: boolean;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const query = searchParams.toString();
    return this.request<{ courses: any[]; pagination: any }>(`/courses${query ? `?${query}` : ''}`);
  }

  async getCourseById(id: string) {
    return this.request<{ course: any }>(`/courses/${id}`);
  }

  async createCourse(courseData: any) {
    return this.request<{ course: any; message: string }>('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id: string, updates: any) {
    return this.request<{ course: any; message: string }>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteCourse(id: string) {
    return this.request<{ message: string }>(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // Lesson endpoints
  async getLessonsByCourse(courseId: string) {
    return this.request<{ lessons: any[] }>(`/lessons/course/${courseId}`);
  }

  async getLessonById(id: string) {
    return this.request<{ lesson: any }>(`/lessons/${id}`);
  }

  async createLesson(lessonData: any) {
    return this.request<{ lesson: any; message: string }>('/lessons', {
      method: 'POST',
      body: JSON.stringify(lessonData),
    });
  }

  async updateLesson(id: string, updates: any) {
    return this.request<{ lesson: any; message: string }>(`/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteLesson(id: string) {
    return this.request<{ message: string }>(`/lessons/${id}`, {
      method: 'DELETE',
    });
  }

  // Enrollment endpoints
  async enrollInCourse(courseId: string) {
    return this.request<{ enrollment: any; message: string }>('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  }

  async getUserEnrollments() {
    return this.request<{ enrollments: any[] }>('/enrollments/my-courses');
  }

  // Progress endpoints
  async updateLessonProgress(lessonId: string, data: { completed: boolean; timeSpent?: number }) {
    return this.request<{ progress: any; message: string }>(`/progress/lesson/${lessonId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCourseProgress(courseId: string) {
    return this.request<{ progress: any[] }>(`/progress/course/${courseId}`);
  }

  // Quiz endpoints
  async getQuizById(id: string) {
    return this.request<{ quiz: any }>(`/quiz/${id}`);
  }

  async submitQuizAttempt(quizId: string, data: { answers: string[]; timeSpent: number }) {
    return this.request<{ result: any; message: string }>(`/quiz/${quizId}/attempt`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Stats endpoints
  async getAdminStats() {
    return this.request<{ stats: any }>('/stats/admin');
  }

  async getTeacherStats() {
    return this.request<{ stats: any }>('/stats/teacher');
  }

  async getStudentStats() {
    return this.request<{ stats: any }>('/stats/student');
  }

  // User management (Admin)
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const query = searchParams.toString();
    return this.request<{ users: any[]; pagination: any }>(`/users${query ? `?${query}` : ''}`);
  }

  async getUserById(id: string) {
    return this.request<{ user: any }>(`/users/${id}`);
  }

  async updateUser(id: string, updates: any) {
    return this.request<{ user: any; message: string }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id: string) {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Product endpoints
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    active?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const query = searchParams.toString();
    return this.request<{ products: any[]; pagination: any }>(`/products${query ? `?${query}` : ''}`);
  }

  async getProductById(id: string) {
    return this.request<{ product: any }>(`/products/${id}`);
  }

  async createProduct(productData: any) {
    return this.request<{ product: any; message: string }>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, updates: any) {
    return this.request<{ product: any; message: string }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProduct(id: string) {
    return this.request<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Announcements endpoints
  async getAnnouncements() {
    return this.request<{ announcements: any[] }>('/announcements');
  }

  async createAnnouncement(data: any) {
    return this.request<{ announcement: any; message: string }>('/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAnnouncement(id: string, updates: any) {
    return this.request<{ announcement: any; message: string }>(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteAnnouncement(id: string) {
    return this.request<{ message: string }>(`/announcements/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);